// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol";

/**
 * @title BasketManagerV3
 * @dev Contract is responsible for mAsset and bAsset exchange process and
 * managing basket with bAsset tokens.
 * Allows to add and/or remove bAsset, calculate balances, converts tokens quantity
 * to adjust precisions or set/get parameters: factor, range and paused.
 */

contract BasketManagerV3 is OwnableUpgradeable, ERC1967UpgradeUpgradeable {
    using SafeMath for uint256;

    // Events

    /**
     * @dev Event emitted when basset is added.
     * @param basset Address of the bAsset contract.
     */
    event BassetAdded(address basset);

    /**
     * @dev Event emitted when basset is removed.
     * @param basset Address of the bAsset contract.
     */
    event BassetRemoved(address basset);

    /**
     * @dev Event emitted when factor is changed.
     * @param basset Address of the bAsset contract.
     * @param factor Factor of fees.
     */
    event FactorChanged(address basset, int256 factor);

    /**
     * @dev Event emitted when range is changed.
     * @param basset    Address of the bAsset contract.
     * @param min       Minimal value of range.
     * @param max       Maximal value of range.
     */
    event RangeChanged(address basset, uint256 min, uint256 max);

    /**
     * @dev Event emitted when paused is changed.
     * @param basset    Address of the bAsset contract.
     * @param paused    Determine if paused or not.
     */
    event PausedChanged(address basset, bool paused);

    uint256 constant MAX_VALUE = 1000;

    // state
    string version;
    address massetManager;
    address[] private bassetsArray;
    mapping(address => int256) private factorMap;
    mapping(address => address) private DEPRECATED_bridgeMap;
    mapping(address => uint256) private minMap;
    mapping(address => uint256) private maxMap;
    mapping(address => bool) private pausedMap;

    // Modifiers

    /**
     * @dev Prevents a contract from making actions on paused bAssets.
     */
    modifier notPaused(address _basset) {
        _notPaused(_basset);
        _;
    }

    /**
     * @dev Prevents a contract from making actions on invalid bAssets.
     */
    modifier validBasset(address _basset) {
        _validBasset(_basset);
        _;
    }

    /**
     * @dev Prevents a contract from making actions on paused bAssets.
     * This method is called and separated from modifier to optimize bytecode and save gas.
     */
    function _notPaused(address _basset) internal view {
        require(!pausedMap[_basset], "basset is paused");
    }

    /**
     * @dev Prevents a contract from making actions on invalid bAssets.
     * This method is called and separated from modifier to optimize bytecode and save gas.
     */
    function _validBasset(address _basset) internal view {
        require(factorMap[_basset] != 0, "invalid basset");
    }

    // Initializer

    /**
     * @dev Contract initializer.
     * @param _massetManager     Address of the MassetManager contract.
     */
    function initialize(address _massetManager) external initializer {
        require(massetManager == address(0), "already initialized");
        massetManager = _massetManager;
        version = "3.0";

        __Ownable_init_unchained();
    }

    // Methods for MassetManager logic

    /**
     * @dev Checks if bAasset is valid by checking its presence in the bAssets factors list.
     */
    function isValidBasset(address _basset) public view returns (bool) {
        return (factorMap[_basset] != 0);
    }

    /**
     * @dev Checks if ratio of bAssets in basket is within limits to make a deposit of specific asset.
     * @param _basset           Address of bAsset to deposit.
     * @param _bassetQuantity   Amount of bAssets to deposit.
     * @return Flag indicating whether a deposit can be made.
     */
    function checkBasketBalanceForDeposit(
        address _basset,
        uint256 _bassetQuantity
    ) public view validBasset(_basset) notPaused(_basset) returns (bool) {
        (uint256 massetQuantity, ) = convertBassetToMassetQuantity(_basset, _bassetQuantity);
        uint256 bassetBalance = IERC20(_basset).balanceOf(massetManager);

        (uint256 totalBassetBalanceInMasset, ) = convertBassetToMassetQuantity(
            _basset,
            bassetBalance
        );

        uint256 balance = totalBassetBalanceInMasset.add(massetQuantity);
        uint256 total = getTotalMassetBalance().add(massetQuantity);
        uint256 ratio = balance.mul(MAX_VALUE).div(total);
        uint256 max = maxMap[_basset];
        return ratio <= max;
    }

    /**
     * @dev Checks if ratio of bAssets in basket is within limits to make a withdrawal of specific asset.
     * @param _basset           Address of bAsset to redeem.
     * @param _bassetQuantity   Amount of bAssets to redeem.
     * @return Flag indicating whether a withdrawal can be made.
     */
    function checkBasketBalanceForWithdrawal(
        address _basset,
        uint256 _bassetQuantity
    ) public view validBasset(_basset) notPaused(_basset) returns (bool) {
        (uint256 massetQuantity, ) = convertBassetToMassetQuantity(_basset, _bassetQuantity);
        uint256 bassetBalance = IERC20(_basset).balanceOf(massetManager);
        (uint256 totalBassetBalanceInMasset, ) = convertBassetToMassetQuantity(
            _basset,
            bassetBalance
        );

        require(totalBassetBalanceInMasset >= massetQuantity, "basset balance is not sufficient");

        uint256 balance = totalBassetBalanceInMasset.sub(massetQuantity);
        uint256 total = getTotalMassetBalance().sub(massetQuantity);
        uint256 min = minMap[_basset];
        if (total == 0) return min == 0;

        uint256 ratio = balance.mul(MAX_VALUE).div(total);
        return ratio >= min;
    }

    /**
     * @dev Converts bAsset to mAsset quantity. This is used to adjust precision.
     *      Despite bAssets and mAssets having 1:1 ratio, they may have diffrent decimal factors.
     *      Since the ratio may cause fractions, the bAsset is adjusted to match nearest non fraction amount and returned.
     * @param _basset           Address of bAsset.
     * @param _bassetQuantity   Amount of bAssets to check.
     * @return massetQuantity Calculated amount of mAssets.
     * @return bassetQuantity Calculated amount of Adjusted amount of bAssets.
     */
    function convertBassetToMassetQuantity(
        address _basset,
        uint256 _bassetQuantity
    ) public view validBasset(_basset) returns (uint256 massetQuantity, uint256 bassetQuantity) {
        int256 factor = factorMap[_basset];
        if (factor > 0) {
            massetQuantity = _bassetQuantity.div(uint256(factor));
            bassetQuantity = massetQuantity.mul(uint256(factor));
            return (massetQuantity, bassetQuantity);
        }
        massetQuantity = _bassetQuantity.mul(uint256(-factor));
        return (massetQuantity, _bassetQuantity);
    }

    /**
     * @dev Converts mAsset to bAsset quantity. This is used to adjust precisions.
     *      Despite bAssets and mAssets having 1:1 ratio, they may have diffrent decimal factors.
     *      Since the ratio may cause fractions, the mAsset is adjusted to match nearest non fraction amount and returned.
     * @param _basset           Address of bAsset.
     * @param _massetQuantity   Amount of mAssets to check.
     * @return bassetQuantity Calculated amount of Adjusted amount of bAssets.
     * @return massetQuantity Calculated amount of mAssets.
     */
    function convertMassetToBassetQuantity(
        address _basset,
        uint256 _massetQuantity
    ) public view validBasset(_basset) returns (uint256 bassetQuantity, uint256 massetQuantity) {
        int256 factor = factorMap[_basset];
        if (factor > 0) {
            bassetQuantity = _massetQuantity.mul(uint256(factor));
            return (bassetQuantity, _massetQuantity);
        }
        bassetQuantity = _massetQuantity.div(uint256(-factor));
        massetQuantity = bassetQuantity.mul(uint256(-factor));
        return (bassetQuantity, massetQuantity);
    }

    // Getters

    /**
     * @dev Calculates total mAsset balance.
     * @return total Calculated total balance.
     */
    function getTotalMassetBalance() public view returns (uint256 total) {
        for (uint256 i = 0; i < bassetsArray.length; i++) {
            address basset = bassetsArray[i];
            uint256 balance = IERC20(basset).balanceOf(massetManager);
            (uint256 massetQuantity, ) = convertBassetToMassetQuantity(basset, balance);
            total += massetQuantity;
        }
    }

    function getBassetBalance(address _basset) public view returns (uint256) {
        return IERC20(_basset).balanceOf(massetManager);
    }

    function getVersion() external view returns (string memory) {
        return version;
    }

    function getBassets() public view returns (address[] memory) {
        return bassetsArray;
    }

    function getFactor(address _basset) public view validBasset(_basset) returns (int256) {
        return factorMap[_basset];
    }

    function getRange(
        address _basset
    ) public view validBasset(_basset) returns (uint256 min, uint256 max) {
        min = minMap[_basset];
        max = maxMap[_basset];
    }

    function getPaused(address _basset) public view validBasset(_basset) returns (bool) {
        return pausedMap[_basset];
    }

    // Admin methods

    /**
     * @dev Adds a new bAsset.
     * @param _basset       Address of bAsset.
     * @param _factor       Factor amount.
     * @param _min          Minimum ratio in basket.
     * @param _max          Maximum ratio in basket.
     * @param _paused       Flag to determine if basset should be paused.
     */
    function addBasset(
        address _basset,
        int256 _factor,
        uint256 _min,
        uint256 _max,
        bool _paused
    ) public onlyOwner {
        require(_basset != address(0), "invalid basset address");
        require(factorMap[_basset] == 0, "basset already exists");
        require(_factor != 0, "invalid factor");

        bassetsArray.push(_basset);

        setFactor(_basset, _factor);
        setRange(_basset, _min, _max);
        setPaused(_basset, _paused);

        emit BassetAdded(_basset);
    }

    /**
     * @dev Adds multiple bAssets.
     * @notice All parameters must be arrays with proper order and equal length.
     */
    function addBassets(
        address[] memory _bassets,
        int256[] memory _factors,
        uint256[] memory _mins,
        uint256[] memory _maxs,
        bool[] memory _pausedFlags
    ) public onlyOwner {
        uint256 length = _bassets.length;
        require(
            _factors.length == length &&
                _mins.length == length &&
                _maxs.length == length &&
                _pausedFlags.length == length,
            "invalid lengths"
        );

        for (uint256 i = 0; i < length; i++) {
            addBasset(_bassets[i], _factors[i], _mins[i], _maxs[i], _pausedFlags[i]);
        }
    }

    function setRange(
        address _basset,
        uint256 _min,
        uint256 _max
    ) public validBasset(_basset) onlyOwner {
        require(_min <= MAX_VALUE, "invalid minimum");
        require(_max <= MAX_VALUE, "invalid maximum");
        require(_max >= _min, "invalid range");
        minMap[_basset] = _min;
        maxMap[_basset] = _max;

        emit RangeChanged(_basset, _min, _max);
    }

    /**
     * @dev Returns true if the number is power of ten.
     * @param x     Number to be checked.
     * @return      result Is the number power of ten.
     */
    function isPowerOfTen(int256 x) public pure returns (bool result) {
        uint256 number;

        if (x < 0) number = uint256(-x);
        else number = uint256(x);

        while (number >= 10 && number % 10 == 0) {
            number /= 10;
        }

        result = number == 1;
    }

    function setFactor(address _basset, int256 _factor) public onlyOwner {
        require(_factor != 0, "invalid factor");
        require(_factor == 1 || isPowerOfTen(_factor), "factor must be power of 10");
        factorMap[_basset] = _factor;

        emit FactorChanged(_basset, _factor);
    }

    function setPaused(address _basset, bool _flag) public validBasset(_basset) onlyOwner {
        pausedMap[_basset] = _flag;

        emit PausedChanged(_basset, _flag);
    }

    /**
     * @dev Removes bAsset
     * @param _basset       Address of bAsset to remove.
     */
    function removeBasset(address _basset) public validBasset(_basset) onlyOwner {
        require(getBassetBalance(_basset) == 0, "balance not zero");
        factorMap[_basset] = 0;

        uint256 index;
        for (uint256 i = 0; i < bassetsArray.length - 1; i++) {
            if (bassetsArray[i] == _basset) {
                index = i;
                break;
            }
        }

        bassetsArray[index] = bassetsArray[bassetsArray.length - 1];
        bassetsArray.pop();

        emit BassetRemoved(_basset);
    }

    /**
     * @dev get the implementation logic address referring to ERC1967 standard.
     *
     * @return logic implementation address.
     */
    function getProxyImplementation() external view returns (address) {
        return ERC1967UpgradeUpgradeable._getImplementation();
    }
}
