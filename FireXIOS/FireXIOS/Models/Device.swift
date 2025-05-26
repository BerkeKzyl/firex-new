import Foundation
import CoreLocation

struct Location: Codable {
    let type: String?
    let coordinates: [Double]?
}

struct Device: Identifiable, Decodable {
    let id: String?
    let deviceId: Int?
    let temperature: Double?
    let humidity: Double?
    let timestamp: String?
    let gasDetected: Bool?
    let location: Location?

    var latitude: Double? { location?.coordinates?[safe: 1] }
    var longitude: Double? { location?.coordinates?[safe: 0] }

    var coordinate: CLLocationCoordinate2D? {
        guard let lat = latitude, let lon = longitude else { return nil }
        return CLLocationCoordinate2D(latitude: lat, longitude: lon)
    }

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case deviceId = "deviceId"
        case temperature
        case humidity
        case timestamp
        case gasDetected
        case location
    }
}

// Güvenli dizi erişimi için extension
extension Array {
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
} 
