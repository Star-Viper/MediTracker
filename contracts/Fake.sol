// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Fake {
    address public admin;
    uint256 length = 1;

    enum UserRole {
        None,
        Manufacturer,
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
        string prd_name;
        string prd_id;
        string batch_no;
        uint256 manufacturingDate;
        uint256 expirationDate;
        string qrCode;
    }

    mapping(address => User) public users;
    mapping(string => Product) public products;

    event UserAdded(address indexed userAddress, string name, UserRole role);
    event ProductUploaded(
        string prd_id,
        string prd_name,
        uint256 manufacturingDate,
        uint256 expirationDate,
        string qrCode
    );
    struct ProductInfo {
        string prd_id;
        string prd_name;
        string batch_no;
        uint256 manufacturingDate;
        uint256 expirationDate;
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
        if (role == UserRole.User) {
            require(
                users[msg.sender].role == UserRole.None ||
                    users[msg.sender].role == UserRole.Manufacturer,
                "User already exists"
            );
            users[msg.sender] = User(msg.sender, name, password, role);
            emit UserAdded(msg.sender, name, role);
        } else if (role == UserRole.Manufacturer) {
            require(
                msg.sender == admin,
                "Only admin can add users with Manufacturer role"
            );
            require(
                users[msg.sender].role == UserRole.None ||
                    users[msg.sender].role == UserRole.Manufacturer,
                "User already exists"
            );
            address manufacturerAddress = userAddress;
            users[manufacturerAddress] = User(
                manufacturerAddress,
                name,
                password,
                role
            );
            emit UserAdded(manufacturerAddress, name, role);
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
        string memory prd_id,
        string memory prd_name,
        string memory batch_no,
        string memory qrCode
    ) external onlyManufacturer {
        uint256 manufacturingDate = block.timestamp;
        uint256 expirationDate = block.timestamp + 365 days;

        products[prd_id] = Product(
            prd_name,
            prd_id,
            batch_no,
            manufacturingDate,
            expirationDate,
            qrCode
        );

        // Push the new product ID into the array
        productIds.push(prd_id);

        emit ProductUploaded(
            prd_id,
            prd_name,
            manufacturingDate,
            expirationDate,
            qrCode
        );
    }

    function isReal(
        string memory prd_id_or_qrCode
    ) external view returns (bool, ProductInfo memory) {
        for (uint i = 0; i < productIds.length; i++) {
            if (
                keccak256(abi.encodePacked(productIds[i])) ==
                keccak256(abi.encodePacked(prd_id_or_qrCode)) ||
                keccak256(abi.encodePacked(products[productIds[i]].qrCode)) ==
                keccak256(abi.encodePacked(prd_id_or_qrCode))
            ) {
                Product storage product = products[productIds[i]];
                return (
                    true,
                    ProductInfo(
                        product.prd_id,
                        product.prd_name,
                        product.batch_no,
                        product.manufacturingDate,
                        product.expirationDate
                    )
                );
            }
        }
        return (false, ProductInfo("", "", "", 0, 0));
    }
}