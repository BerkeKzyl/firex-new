import Foundation

struct User: Codable {
    let id: String
    let email: String
    var firstName: String?
    var lastName: String?
    var profileImage: String? // base64 veya url olabilir
}

struct AuthResponse: Codable {
    let token: String
    let user: User
} 
