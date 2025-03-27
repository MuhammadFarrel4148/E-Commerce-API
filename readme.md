# E-Commerce API
API yang dibangun untuk platform E-Commerce.

![Architecture E-Commerce API][architecture]

## Fitur Utama
- **Terdapat sign up dan log in**
- **Dapat menambahkan produk ke dalam cart**
- **Dapat melakukan remove produk pada cart**
- **Dapat melakukan view dan search pada produk**
- **Dapat melakukan checkout dan pay pada product**

## Teknologi yang Digunakan
- **Node.js**: Runtime javascript
- **MySQL**: Database relasional
- **Postman**: Testing dan dokumentasi
- **Dotenv**: Mengelola environment variables
- **Docker** (opsional): containerization 
- **GitHub**: Version control dan menyimpan proyek
- **Express**: Framework backend

## Struktur Database
### Table Users
```json
{
    "id_users": "string(16) PRIMARY KEY",
    "username": "string(255)",
    "email": "string(255)",
    "password": "string(255)",
}
```

### Table CodeOTP
```json
{
    "code": "string(5) PRIMARY KEY",
    "email": "string(255)"
}
```

### Table Blacklist Token
```json
{
    "token": "string(255) PRIMARY KEY"
}
```

### Table Product
```json
{
    "id_product": "string(16) PRIMARY KEY",
    "title": "string(255)",
    "description": "string(255)",
    "cost": "float",
    "seller": "string(255)",
}
```

### Table Cart
```json
{
    "id": "string(16) PRIMARY KEY",
    "id_users": "string(16) FOREIGN KEY REFERENCE users(id_users)",
    "id_product": "string(16) FOREIGN KEY REFERENCE product(id_product)"
}
```

## Instalasi (Coming Soon)
1. 

## Endpoint
| HTTP Method | Endpoint                                    | Deskripsi                                                          |
|-------------|---------------------------------------------|--------------------------------------------------------------------|
| POST        | /register                                   | membuat akun baru e-commerce                                       |
| POST        | /login                                      | melakukan login akun e-commerce                                    |
| POST        | /forgotPassword                             | melakukan reset password dengan input email                        |
| POST        | /inputotp                                   | melakukan reset password dengan input code OTP                     |
| POST        | /changePassword                             | melakukan change password pada akun                                |
| POST        | /logout                                     | melakukan logout akun e-commerce                                   |
| POST        | /add/:idProduct                             | melakukan tambah produk ke dalam cart                              |
| PUT         | /remove/:idCart                             | melakukan remove produk pada cart                                  |
| GET         | /product/:idProduct?{title, description}    | melakukan view pada produk yang memiliki opsional query            |
| POST        | /checkout                                   | melakukan payment kepada produk                                    |

## Penulis
- **Muhammad Farrel Putra Pambudi**
    - ([GitHub](https://github.com/MuhammadFarrel4148))
    - ([LinkedIn](https://www.linkedin.com/in/farrelputrapambudi))

## Reference Project
- ([roadmap.sh](https://roadmap.sh/projects/ecommerce-api))

[architecture]: architecture-e-commerce-API.png

