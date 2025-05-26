import CoreML
import Vision
import UIKit

class LeafClassifier {
    private var classificationRequest: VNCoreMLRequest?
    private let modelName = "LeafClassifierModel" // Update this with your model name
    
    init() {
        setupModel()
    }
    
    private func setupModel() {
        guard let modelURL = Bundle.main.url(forResource: modelName, withExtension: "mlmodelc") else {
            print("Failed to find the model in the bundle")
            return
        }
        
        do {
            let model = try MLModel(contentsOf: modelURL)
            let visionModel = try VNCoreMLModel(for: model)
            classificationRequest = VNCoreMLRequest(model: visionModel) { [weak self] request, error in
                self?.processClassifications(for: request, error: error)
            }
            classificationRequest?.imageCropAndScaleOption = .centerCrop
        } catch {
            print("Failed to load Vision ML model: \(error)")
        }
    }
    
    func classifyLeaf(image: UIImage, completion: @escaping (String?, Error?) -> Void) {
        guard let classificationRequest = classificationRequest else {
            completion(nil, NSError(domain: "LeafClassifier", code: -1, userInfo: [NSLocalizedDescriptionKey: "Model not initialized"]))
            return
        }
        
        guard let ciImage = CIImage(image: image) else {
            completion(nil, NSError(domain: "LeafClassifier", code: -2, userInfo: [NSLocalizedDescriptionKey: "Failed to create CIImage"]))
            return
        }
        
        let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
        do {
            try handler.perform([classificationRequest])
        } catch {
            completion(nil, error)
        }
    }
    
    private func processClassifications(for request: VNRequest, error: Error?) {
        if let error = error {
            print("Failed to process image: \(error)")
            return
        }
        
        guard let results = request.results as? [VNClassificationObservation] else {
            print("Unexpected result type from VNCoreMLRequest")
            return
        }
        
        if let topResult = results.first {
            print("Classification: \(topResult.identifier) with confidence: \(topResult.confidence)")
        }
    }
} 
