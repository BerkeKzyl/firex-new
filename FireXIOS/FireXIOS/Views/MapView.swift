import SwiftUI
import MapKit
import CoreML
import Vision
import CoreLocation

struct LeafIdentifierSheet: View {
    @State private var selectedImage: UIImage?
    @State private var showImagePicker = false
    @State private var showCamera = false
    @State private var result: String?
    @State private var isProcessing = false

    var body: some View {
        VStack(spacing: 20) {
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 220)
            } else {
                Rectangle()
                    .fill(Color.gray.opacity(0.2))
                    .frame(height: 220)
                    .overlay(Text("Fotoğraf seç veya çek"))
            }
            HStack {
                Button("Fotoğraf Çek") { showCamera = true }
                    .buttonStyle(.bordered)
                Button("Galeriden Seç") { showImagePicker = true }
                    .buttonStyle(.bordered)
            }
            if isProcessing {
                ProgressView("Analiz ediliyor...")
            } else if let result = result {
                Text("Tahmin: \(result)")
                    .font(.headline)
                    .foregroundColor(.green)
            }
            Spacer()
        }
        .padding()
        .sheet(isPresented: $showImagePicker) {
            ImagePicker(image: $selectedImage)
        }
        .sheet(isPresented: $showCamera) {
            CameraView(image: $selectedImage)
        }
        .onChange(of: selectedImage) { (oldValue: UIImage?, newValue: UIImage?) in
            if let image = newValue {
                classify(image: image)
            }
        }
    }
    func classify(image: UIImage) {
        isProcessing = true
        result = nil
        guard let ciImage = CIImage(image: image),
              let model = try? VNCoreMLModel(for: LeafClassifierModel().model) else {
            result = "Model yüklenemedi."
            isProcessing = false
            return
        }
        let request = VNCoreMLRequest(model: model) { request, error in
            DispatchQueue.main.async {
                if let results = request.results as? [VNClassificationObservation], let topResult = results.first {
                    result = "Tahmin: \(topResult.identifier) (%\(Int(topResult.confidence * 100)))"
                } else {
                    result = "Tanıma başarısız."
                }
                isProcessing = false
            }
        }
        let handler = VNImageRequestHandler(ciImage: ciImage)
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform([request])
            } catch {
                print("Model tahmini sırasında hata: \(error)")
            }
        }
    }
}

enum MapAnnotationItem: Identifiable {
    case report(FireReportWithSource)
    case device(Device)

    var id: String {
        switch self {
        case .report(let r): return "report_" + (r.id ?? UUID().uuidString)
        case .device(let d): return "device_" + (d.id ?? UUID().uuidString)
        }
    }
    var coordinate: CLLocationCoordinate2D {
        switch self {
        case .report(let r): return r.report.coordinate
        case .device(let d):
            return d.coordinate ?? CLLocationCoordinate2D(latitude: 0, longitude: 0)
        }
    }
}

struct MapView: View {
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 41.0082, longitude: 28.9784),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    @State private var reports: [FireReportWithSource] = []
    @State private var devices: [Device] = []
    @State private var selectedReport: FireReportWithSource?
    @State private var selectedDevice: Device?
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showLeafSheet = false
    
    var allAnnotations: [MapAnnotationItem] {
        reports.map { .report($0) } + devices.map { .device($0) }
    }
    
    var body: some View {
        ZStack {
            Map(coordinateRegion: $region, annotationItems: allAnnotations) { item in
                MapAnnotation(coordinate: item.coordinate) {
                    switch item {
                    case .report(let report):
                        Button(action: { selectedReport = report }) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 32))
                                .foregroundColor(Color.orange)
                                .shadow(radius: 4)
                        }
                    case .device(let device):
                        Button(action: { selectedDevice = device }) {
                            Image(systemName: "mappin.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor((device.gasDetected ?? false) ? .red : .blue)
                                .shadow(radius: 4)
                        }
                    }
                }
            }
            .mapControls {
                MapUserLocationButton()
                MapCompass()
            }
            .ignoresSafeArea()
            .overlay(
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        VStack(spacing: 8) {
                            Button(action: {
                                // Zoom in
                                withAnimation {
                                    region.span.latitudeDelta /= 1.5
                                    region.span.longitudeDelta /= 1.5
                                }
                            }) {
                                Image(systemName: "plus.magnifyingglass")
                                    .font(.title2)
                                    .padding(8)
                                    .background(Color.white.opacity(0.9))
                                    .clipShape(Circle())
                                    .shadow(radius: 2)
                            }
                            Button(action: {
                                // Zoom out
                                withAnimation {
                                    region.span.latitudeDelta *= 1.5
                                    region.span.longitudeDelta *= 1.5
                                }
                            }) {
                                Image(systemName: "minus.magnifyingglass")
                                    .font(.title2)
                                    .padding(8)
                                    .background(Color.white.opacity(0.9))
                                    .clipShape(Circle())
                                    .shadow(radius: 2)
                            }
                        }
                        .padding(.trailing, 16)
                        .padding(.bottom, 160)
                    }
                }
            )
            .overlay(
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Button(action: { showLeafSheet = true }) {
                            Image(systemName: "leaf.fill")
                                .font(.system(size: 28))
                                .foregroundColor(.green)
                                .frame(width: 48, height: 48)
                                .background(Color.white.opacity(0.9))
                                .clipShape(Circle())
                                .shadow(radius: 2)
                        }
                        .padding(.trailing, 16)
                    }
                    .padding(.bottom, 32)
                }
            )
            if isLoading {
                ProgressView()
            }
            if let errorMessage = errorMessage {
                VStack {
                    Spacer()
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                        .background(Color(.systemBackground).opacity(0.9))
                        .cornerRadius(12)
                    Spacer()
                }
            }
            if let device = selectedDevice {
                VStack(spacing: 18) {
                    HStack {
                        Text("Device ID: \(device.deviceId ?? 0)")
                            .font(.headline)
                        Spacer()
                        Button(action: { selectedDevice = nil }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.title2)
                                .foregroundColor(.gray)
                        }
                    }
                    Text("Zaman: \(device.timestamp ?? "-")")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Sıcaklık")
                                .font(.caption)
                            Text("\(String(format: "%.1f", device.temperature ?? 0)) °C")
                                .font(.title2)
                                .foregroundColor(.red)
                        }
                        Spacer()
                        VStack(alignment: .leading) {
                            Text("Nem")
                                .font(.caption)
                            Text("\(String(format: "%.1f", device.humidity ?? 0)) %")
                                .font(.title2)
                                .foregroundColor(.blue)
                        }
                        Spacer()
                        VStack(alignment: .leading) {
                            Text("Gaz")
                                .font(.caption)
                            Text((device.gasDetected ?? false) ? "Var" : "Yok")
                                .font(.title2)
                                .foregroundColor((device.gasDetected ?? false) ? .red : .green)
                        }
                    }
                }
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(16)
                .shadow(radius: 8)
                .frame(maxWidth: 320)
                .padding()
            }
        }
        .onAppear(perform: loadAllData)
        .sheet(item: $selectedReport) { report in
            ReportDetailSheet(report: report)
        }
        .sheet(isPresented: $showLeafSheet) {
            LeafIdentifierSheet()
        }
    }
    
    private func loadAllData() {
        isLoading = true
        errorMessage = nil
        Task {
            do {
                let webReports = try await NetworkService.shared.fetchRecentReports()
                let mobileReports = try await NetworkService.shared.fetchMobileReports()
                let web = webReports.map { FireReportWithSource(report: $0, source: .web) }
                let mobile = mobileReports.map { FireReportWithSource(report: $0, source: .mobile) }
                let fetchedDevices = try await NetworkService.shared.fetchDevices()
                await MainActor.run {
                    let allReports = web + mobile
                    let filteredReports = allReports.filter { reportWithSource in
                        let status = reportWithSource.report.status?.lowercased() ?? "active"
                        let showOnMap = reportWithSource.report.showOnMap
                        return status == "active" && (showOnMap == nil || showOnMap == true)
                    }
                    self.reports = filteredReports
                    self.devices = fetchedDevices
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "Veriler yüklenemedi: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
}

enum ReportSource: String, Identifiable, Codable {
    case web, mobile
    var id: String { rawValue }
}

struct FireReportWithSource: Identifiable {
    let report: FireReport
    let source: ReportSource
    var id: String { report.id + source.rawValue }
}

struct ReportDetailSheet: View {
    let report: FireReportWithSource
    
    // ISO8601 string'den Date'e çeviren yardımcı fonksiyon
    func iso8601StringToDate(_ str: String) -> Date? {
        let formatter = ISO8601DateFormatter()
        return formatter.date(from: str)
    }
    // Base64 string'i data:image ile başlıyorsa ayıkla
    func extractBase64(from imageURL: String) -> String? {
        if imageURL.hasPrefix("data:image") {
            guard let commaIdx = imageURL.firstIndex(of: ",") else { return nil }
            let base64Start = imageURL.index(after: commaIdx)
            return String(imageURL[base64Start...])
        } else {
            return imageURL
        }
    }
    // Türkiye saatine göre Date döndür
    func dateInTurkey(from iso: String) -> Date? {
        guard let utcDate = iso8601StringToDate(iso) else { return nil }
        let tz = TimeZone(identifier: "Europe/Istanbul") ?? .current
        let seconds = TimeInterval(tz.secondsFromGMT(for: utcDate))
        return utcDate.addingTimeInterval(seconds - TimeInterval(TimeZone(secondsFromGMT: 0)!.secondsFromGMT(for: utcDate)))
    }
    // Türkiye formatında string döndür
    func formattedTurkeyDateString(from iso: String) -> String {
        guard let date = dateInTurkey(from: iso) else { return iso }
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy HH:mm"
        formatter.timeZone = TimeZone(identifier: "Europe/Istanbul")
        return formatter.string(from: date)
    }
    var body: some View {
        VStack(spacing: 18) {
            Text(report.source == .web ? "Web Raporu" : "Mobil Rapor")
                .font(.headline)
                .foregroundColor(report.source == .web ? .orange : .blue)
            Text(formattedTurkeyDateString(from: report.report.timestamp))
                .font(.subheadline)
                .foregroundColor(.secondary)
            if let imageURL = report.report.imageURL, let base64 = extractBase64(from: imageURL), let data = Data(base64Encoded: base64), let uiImage = UIImage(data: data) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 320)
                    .cornerRadius(10)
            }
            Text(report.report.comment)
                .font(.body)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
            Spacer()
        }
        .padding()
        .presentationDetents([.medium, .large])
    }
}

struct DeviceWrapper: Identifiable {
    let device: Device
    var id: String { device.id ?? UUID().uuidString }
}

#Preview {
    MapView()
}
