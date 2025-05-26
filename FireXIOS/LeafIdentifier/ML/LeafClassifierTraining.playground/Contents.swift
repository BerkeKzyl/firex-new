import CreateML
import Foundation

// 1. Eğitim ve doğrulama veri yollarını ayarla
let trainURL = URL(fileURLWithPath: "/Users/taha/Code/FireXNew/FireXIOS/LeafIdentifier/Dataset/train")
let validationURL = URL(fileURLWithPath: "/Users/taha/Code/FireXNew/FireXIOS/LeafIdentifier/Dataset/validation")

// 2. Verileri yükle
let trainingData = try MLImageClassifier.DataSource.labeledDirectories(at: trainURL)
let validationData = try MLImageClassifier.DataSource.labeledDirectories(at: validationURL)

// 3. Model parametrelerini ayarla (isteğe bağlı)
let parameters = MLImageClassifier.ModelParameters(validationData: validationData)

// 4. Modeli eğit
let classifier = try MLImageClassifier(trainingData: trainingData, parameters: parameters)

// 5. Modeli kaydet
try classifier.write(to: URL(fileURLWithPath: "/Users/taha/Code/FireXNew/FireXIOS/LeafIdentifier/LeafClassifier.mlmodel"))

// 6. Sonuçları yazdır
print("Training accuracy: \(1.0 - classifier.trainingMetrics.classificationError)")
print("Validation accuracy: \(1.0 - classifier.validationMetrics.classificationError)")
