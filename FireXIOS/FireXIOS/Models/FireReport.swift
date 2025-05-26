import Foundation
import CoreLocation

private struct AnyCodingKey: CodingKey {
    var stringValue: String
    var intValue: Int? { nil }
    init(_ string: String) { self.stringValue = string }
    init?(stringValue: String) { self.stringValue = stringValue }
    init?(intValue: Int) { return nil }
}

struct FireReport: Codable, Identifiable {
    let id: String
    let userId: String?
    let latitude: Double
    let longitude: Double
    let imageURL: String?
    let comment: String
    let timestamp: String
    let showOnMap: Bool?
    let status: String?
    
    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId = "user_id"
        case latitude
        case longitude
        case imageURL = "image"
        case comment
        case timestamp = "dateTime"
        case showOnMap
        case status
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        userId = try? container.decodeIfPresent(String.self, forKey: .userId)
        latitude = try container.decode(Double.self, forKey: .latitude)
        longitude = try container.decode(Double.self, forKey: .longitude)
        imageURL = try? container.decodeIfPresent(String.self, forKey: .imageURL)
        comment = try container.decode(String.self, forKey: .comment)
        showOnMap = try? container.decodeIfPresent(Bool.self, forKey: .showOnMap)
        status = try? container.decodeIfPresent(String.self, forKey: .status)
        // timestamp: hem dateTime hem timestamp anahtarını dene
        if let dateTime = try? container.decodeIfPresent(String.self, forKey: .timestamp) {
            timestamp = dateTime
        } else if let altTimestamp = try? decoder.container(keyedBy: AnyCodingKey.self).decodeIfPresent(String.self, forKey: AnyCodingKey("timestamp")) {
            timestamp = altTimestamp
        } else {
            throw DecodingError.keyNotFound(CodingKeys.timestamp, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "No value for dateTime or timestamp"))
        }
    }
    
    // Varsayılan init
    init(id: String, userId: String?, latitude: Double, longitude: Double, imageURL: String?, comment: String, timestamp: String, showOnMap: Bool?, status: String?) {
        self.id = id
        self.userId = userId
        self.latitude = latitude
        self.longitude = longitude
        self.imageURL = imageURL
        self.comment = comment
        self.timestamp = timestamp
        self.showOnMap = showOnMap
        self.status = status
    }
} 
