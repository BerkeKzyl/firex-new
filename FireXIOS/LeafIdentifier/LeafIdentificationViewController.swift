import UIKit
import AVFoundation

class LeafIdentificationViewController: UIViewController {
    private let cameraView: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private let captureButton: UIButton = {
        let button = UIButton(type: .system)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle("Capture", for: .normal)
        button.backgroundColor = .systemBlue
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 25
        return button
    }()
    
    private let resultLabel: UILabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textAlignment = .center
        label.numberOfLines = 0
        label.isHidden = true
        return label
    }()
    
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private let leafClassifier = LeafClassifier()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCamera()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        view.addSubview(cameraView)
        view.addSubview(captureButton)
        view.addSubview(resultLabel)
        
        NSLayoutConstraint.activate([
            cameraView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            cameraView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            cameraView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            cameraView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.7),
            
            captureButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            captureButton.topAnchor.constraint(equalTo: cameraView.bottomAnchor, constant: 20),
            captureButton.widthAnchor.constraint(equalToConstant: 100),
            captureButton.heightAnchor.constraint(equalToConstant: 50),
            
            resultLabel.topAnchor.constraint(equalTo: captureButton.bottomAnchor, constant: 20),
            resultLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            resultLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
        
        captureButton.addTarget(self, action: #selector(captureButtonTapped), for: .touchUpInside)
    }
    
    private func setupCamera() {
        captureSession = AVCaptureSession()
        
        guard let captureSession = captureSession,
              let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
              let input = try? AVCaptureDeviceInput(device: backCamera) else {
            return
        }
        
        captureSession.addInput(input)
        
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer?.videoGravity = .resizeAspectFill
        previewLayer?.frame = cameraView.bounds
        
        if let previewLayer = previewLayer {
            cameraView.layer.addSublayer(previewLayer)
        }
        
        DispatchQueue.global(qos: .userInitiated).async {
            captureSession.startRunning()
        }
    }
    
    @objc private func captureButtonTapped() {
        guard let captureSession = captureSession else { return }
        
        let photoOutput = AVCapturePhotoOutput()
        captureSession.addOutput(photoOutput)
        
        let settings = AVCapturePhotoSettings()
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
}

extension LeafIdentificationViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("Error capturing photo: \(error)")
            return
        }
        
        guard let imageData = photo.fileDataRepresentation(),
              let image = UIImage(data: imageData) else {
            return
        }
        
        leafClassifier.classifyLeaf(image: image) { [weak self] result, error in
            DispatchQueue.main.async {
                if let error = error {
                    self?.resultLabel.text = "Error: \(error.localizedDescription)"
                } else if let result = result {
                    self?.resultLabel.text = "Identified as: \(result)"
                }
                self?.resultLabel.isHidden = false
            }
        }
    }
} 
