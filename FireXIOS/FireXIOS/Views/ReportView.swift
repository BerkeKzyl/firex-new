import SwiftUI
import CoreLocation
import PhotosUI

struct ReportView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var selectedImage: UIImage?
    @State private var comment: String = ""
    @State private var isShowingImagePicker = false
    @State private var isShowingCamera = false
    @State private var isSubmitting = false
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var isLocating = false
    @State private var locationError: String? = nil
    
    var body: some View {
        NavigationView {
            Form {
                // Location Section
                Section(header: HStack { Text("Location"); Text("*").foregroundColor(.red) }) {
                    if isLocating {
                        HStack { ProgressView(); Text("Getting location...") }
                    } else if let location = locationManager.location {
                        Text("Latitude: \(location.coordinate.latitude)")
                        Text("Longitude: \(location.coordinate.longitude)")
                    } else if let error = locationError {
                        Text(error).foregroundColor(.red)
                    } else {
                        Text("Getting location...")
                    }
                    Button("Refresh Location") {
                        isLocating = true
                        locationError = nil
                        locationManager.requestLocation()
                    }
                }
                
                // Image Section
                Section(header: HStack { Text("Fire Image"); Text("*").foregroundColor(.red) }) {
                    if let image = selectedImage {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFit()
                            .frame(height: 320)
                            .cornerRadius(10)
                    }
                    
                    HStack {
                        Button("Take Photo") {
                            isShowingCamera = true
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Choose Photo") {
                            isShowingImagePicker = true
                        }
                        .buttonStyle(.bordered)
                    }
                }
                
                // Comment Section
                Section(header: HStack { Text("Comment"); Text("*").foregroundColor(.red) }) {
                    TextEditor(text: $comment)
                        .frame(height: 100)
                    Text("\(comment.count)/120 characters")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                // Submit Button
                Section {
                    Button(action: submitReport) {
                        if isSubmitting {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle())
                        } else {
                            Text("Submit Report")
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .disabled(isSubmitting || selectedImage == nil || comment.isEmpty)
                }
            }
            .navigationTitle("Report Fire")
            .sheet(isPresented: $isShowingImagePicker) {
                ImagePicker(image: $selectedImage)
            }
            .sheet(isPresented: $isShowingCamera) {
                CameraView(image: $selectedImage)
            }
            .alert("Report Status", isPresented: $showAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(alertMessage)
            }
            .onAppear {
                isLocating = true
                locationManager.requestLocation()
            }
            .onReceive(locationManager.$location) { loc in
                if loc != nil { isLocating = false; locationError = nil }
            }
            .onReceive(locationManager.$lastError) { err in
                if let err = err {
                    isLocating = false
                    locationError = err
                }
            }
        }
    }
    
    private func submitReport() {
        guard let image = selectedImage else {
            showAlert = true
            alertMessage = "Fotoğraf zorunlu. Lütfen bir fotoğraf ekleyin."
            return
        }
        guard let location = locationManager.location else {
            showAlert = true
            alertMessage = "Konum zorunlu. Lütfen konumunuzu alın."
            return
        }
        guard !comment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            showAlert = true
            alertMessage = "Yorum zorunlu. Lütfen bir yorum girin."
            return
        }
        isSubmitting = true
        
        Task {
            do {
                let imageData = image.jpegData(compressionQuality: 0.7)
                _ = try await NetworkService.shared.submitReport(
                    latitude: location.coordinate.latitude,
                    longitude: location.coordinate.longitude,
                    imageData: imageData,
                    comment: comment
                )
                
                // Başarılı gönderim
                selectedImage = nil
                comment = ""
                isSubmitting = false
                showAlert = true
                alertMessage = "Rapor başarıyla gönderildi!"
            } catch {
                isSubmitting = false
                showAlert = true
                alertMessage = "Rapor gönderilirken bir hata oluştu: \(error.localizedDescription)"
            }
        }
    }
}

// Location Manager
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var location: CLLocation?
    @Published var lastError: String? = nil
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
    }
    
    func requestLocation() {
        lastError = nil
        locationManager.requestLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.first
        lastError = nil
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        lastError = "Konum alınamadı: \(error.localizedDescription)"
    }
}

// Image Picker
struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .images
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.presentationMode.wrappedValue.dismiss()
            
            guard let provider = results.first?.itemProvider else { return }
            
            if provider.canLoadObject(ofClass: UIImage.self) {
                provider.loadObject(ofClass: UIImage.self) { image, _ in
                    DispatchQueue.main.async {
                        self.parent.image = image as? UIImage
                    }
                }
            }
        }
    }
}

// Camera View
struct CameraView: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = .camera
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: CameraView
        
        init(_ parent: CameraView) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
} 