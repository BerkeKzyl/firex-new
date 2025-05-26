import Foundation
import UIKit

enum NetworkError: Error {
    case invalidURL
    case invalidResponse
    case decodingError
    case serverError(String)
    case unauthorized
    case invalidRequest
}

class NetworkService {
    static let shared = NetworkService()
    private let baseURL = "http://192.168.1.6:3000/api"
    private var authToken: String?
    
    private init() {}
    
    func setAuthToken(_ token: String) {
        self.authToken = token
    }
    
    private func createRequest(_ endpoint: String, method: String = "GET", body: Data? = nil) -> URLRequest? {
        let urlString = baseURL.hasSuffix("/") ? String(baseURL.dropLast()) : baseURL
        let endpointString = endpoint.hasPrefix("/") ? endpoint : "/" + endpoint
        let fullURLString = urlString + endpointString
        guard let url = URL(string: fullURLString) else {
            print("INVALID URL: \(fullURLString)")
            return nil
        }
        print("FULL URL: \(url.absoluteString)")
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = body
        }
        
        // DEBUG LOG
        print("[DEBUG][NetworkService] \(method) \(endpoint) | Token: \(authToken ?? "yok")")
        
        return request
    }
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let loginData = ["email": email, "password": password]
        guard let body = try? JSONEncoder().encode(loginData),
              let request = createRequest("/auth/login", method: "POST", body: body) else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        switch httpResponse.statusCode {
        case 200:
            do {
                let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                setAuthToken(authResponse.token)
                return authResponse
            } catch {
                print("[DECODE ERROR][login]", error)
                if let str = String(data: data, encoding: .utf8) {
                    print("[RESPONSE DATA][login]", str)
                }
                throw NetworkError.decodingError
            }
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.serverError("Login failed")
        }
    }
    
    func register(email: String, password: String, firstName: String, lastName: String) async throws -> AuthResponse {
        let registerData = [
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        ]
        guard let body = try? JSONEncoder().encode(registerData),
              let request = createRequest("/auth/register", method: "POST", body: body) else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        switch httpResponse.statusCode {
        case 201:
            do {
                let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                setAuthToken(authResponse.token)
                return authResponse
            } catch {
                print("[DECODE ERROR][register]", error)
                if let str = String(data: data, encoding: .utf8) {
                    print("[RESPONSE DATA][register]", str)
                }
                throw NetworkError.decodingError
            }
        case 400:
            throw NetworkError.serverError("Registration failed")
        default:
            throw NetworkError.serverError("Unknown error")
        }
    }
    
    func submitReport(latitude: Double, longitude: Double, imageData: Data?, comment: String) async throws -> FireReport {
        let dateString = ISO8601DateFormatter().string(from: Date())
        let reportData: [String: Any] = [
            "latitude": latitude,
            "longitude": longitude,
            "comment": comment,
            "dateTime": dateString,
            "deviceInfo": [
                "platform": "iOS",
                "version": UIDevice.current.systemVersion
            ],
            "showOnMap": true,
            "status": "Active"
        ]
        var requestBody = reportData
        if let imageData = imageData {
            let base64Image = imageData.base64EncodedString()
            requestBody["image"] = base64Image
        }
        guard let body = try? JSONSerialization.data(withJSONObject: requestBody),
              let request = createRequest("/mobile/report", method: "POST", body: body) else {
            throw NetworkError.invalidRequest
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.serverError("Sunucu hatası")
        }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        do {
            let fireReport = try decoder.decode(FireReport.self, from: data)
            return fireReport
        } catch {
            print("[DECODE ERROR][submitReport]", error)
            if let str = String(data: data, encoding: .utf8) {
                print("[RESPONSE DATA][submitReport]", str)
            }
            throw NetworkError.decodingError
        }
    }
    
    func fetchRecentReports() async throws -> [FireReport] {
        guard let request = createRequest("/report") else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        switch httpResponse.statusCode {
        case 200:
            do {
                let decoded = try JSONDecoder().decode([FireReport].self, from: data)
                return decoded
            } catch {
                print("[DECODE ERROR][fetchRecentReports]", error)
                if let str = String(data: data, encoding: .utf8) {
                    print("[RESPONSE DATA][fetchRecentReports]", str)
                }
                throw NetworkError.decodingError
            }
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.serverError("Failed to fetch reports")
        }
    }
    
    func fetchProfile() async throws -> User {
        guard let request = createRequest("/user/profile") else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw NetworkError.invalidResponse
        }
        do {
            return try JSONDecoder().decode(User.self, from: data)
        } catch {
            print("[DECODE ERROR][fetchProfile]", error)
            if let str = String(data: data, encoding: .utf8) {
                print("[RESPONSE DATA][fetchProfile]", str)
            }
            throw NetworkError.decodingError
        }
    }

    func updateProfile(email: String, firstName: String, lastName: String, password: String, imageData: Data?) async throws -> User {
        var bodyDict: [String: Any] = [
            "email": email,
            "firstName": firstName,
            "lastName": lastName,
            "password": password
        ]
        if let imageData = imageData {
            bodyDict["profileImage"] = imageData.base64EncodedString()
        }
        let body = try JSONSerialization.data(withJSONObject: bodyDict)
        guard let request = createRequest("/user/profile", method: "POST", body: body) else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw NetworkError.invalidResponse
        }
        do {
            return try JSONDecoder().decode(User.self, from: data)
        } catch {
            print("[DECODE ERROR][updateProfile]", error)
            if let str = String(data: data, encoding: .utf8) {
                print("[RESPONSE DATA][updateProfile]", str)
            }
            throw NetworkError.decodingError
        }
    }

    func fetchMobileReports() async throws -> [FireReport] {
        guard let request = createRequest("/mobile/report?limit=20") else {
            throw NetworkError.invalidURL
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        switch httpResponse.statusCode {
        case 200:
            do {
                let decoded = try JSONDecoder().decode([FireReport].self, from: data)
                return decoded
            } catch {
                print("[DECODE ERROR][fetchMobileReports]", error)
                if let str = String(data: data, encoding: .utf8) {
                    print("[RESPONSE DATA][fetchMobileReports]", str)
                }
                throw NetworkError.decodingError
            }
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.serverError("Failed to fetch mobile reports")
        }
    }

    func fetchDevices() async throws -> [Device] {
        guard let url = URL(string: "\(baseURL)/devices/latest") else {
            throw NetworkError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        switch httpResponse.statusCode {
        case 200:
            do {
                print("Raw response data:", String(data: data, encoding: .utf8) ?? "No data")
                let devices = try JSONDecoder().decode([Device].self, from: data)
                return devices
            } catch {
                print("[DECODE ERROR][fetchDevices]", error)
                if let str = String(data: data, encoding: .utf8) {
                    print("[RESPONSE DATA][fetchDevices]", str)
                }
                throw NetworkError.decodingError
            }
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.serverError(String(httpResponse.statusCode))
        }
    }
}

