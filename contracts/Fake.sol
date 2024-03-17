// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Fake {
    address public admin;
    uint256 length = 1;

    enum UserRole {
        None,
        Manufacturer,
        Distributor,
        Retailer,
        User
    }

    string[] public productIds;
    struct User {
        address userAddress;
        string name;
        string password;
        UserRole role;
    }

    struct Product {
        string prd_id;
    }

    mapping(address => User) public users;
    mapping(string => Product) public products;

    event UserAdded(address indexed userAddress, string name, UserRole role);
    event ProductUploaded(
        string prd_id
    );
    struct ProductInfo {
        string prd_id;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyManufacturer() {
        require(
            users[msg.sender].role == UserRole.Manufacturer,
            "Only manufacturer can perform this action"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addUser(
        address userAddress,
        string memory name,
        string memory password,
        UserRole role
    ) external {
        if (role == UserRole.User ) {
            require(
                users[msg.sender].role == UserRole.None ||
                    users[msg.sender].role == UserRole.Manufacturer,
                "User already exists"
            );
            users[msg.sender] = User(msg.sender, name, password, role);
            emit UserAdded(msg.sender, name, role);
        } else if (role == UserRole.Manufacturer || role == UserRole.Distributor || role == UserRole.Retailer) {
            require(
                msg.sender == admin,
                "Only admin can add users with Manufacturer role"
            );
            require(
                users[msg.sender].role == UserRole.None || users[msg.sender].role == UserRole.Manufacturer || users[msg.sender].role == UserRole.Distributor || users[msg.sender].role == UserRole.Retailer,
                "User already exists"
            );
            address Address = userAddress;
            users[Address] = User(
                Address,
                name,
                password,
                role
            );
            emit UserAdded(Address, name, role);
        }
    }

    function login(
        string memory password
    ) external view returns (bool success) {
        if (users[msg.sender].role == UserRole.None) {
            return (false);
        }

        if (
            keccak256(abi.encodePacked(users[msg.sender].password)) ==
            keccak256(abi.encodePacked(password))
        ) {
            return (true);
        } else {
            return (false);
        }
    }

    function uploadProduct(
        string memory prd_id
    ) external onlyManufacturer {

        products[prd_id] = Product(
            prd_id
        );

        productIds.push(prd_id);

        emit ProductUploaded(
            prd_id
        );
    }

    function isReal(
        string memory prd_id
    ) external view returns (bool) {
        for (uint i = 0; i < productIds.length; i++) {
            if (
                keccak256(abi.encodePacked(productIds[i])) == keccak256(abi.encodePacked(prd_id))
            ) {
                return true;
            }
        }
        return false;
    }
}