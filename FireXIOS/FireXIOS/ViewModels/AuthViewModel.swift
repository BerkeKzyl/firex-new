import Foundation

@MainActor
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var error: String?
    @Published var isLoading = false
    
    private let networkService = NetworkService.shared
    private let keychainService = KeychainService.shared
    
    init() {
        Task {
            await checkAuthStatus()
        }
    }
    
    private func checkAuthStatus() async {
        isLoading = true
        do {
            if let token = try keychainService.getToken() {
                print("[DEBUG][AuthViewModel] Token bulundu, doğrulanıyor...")
                networkService.setAuthToken(token)
                
                // Token'ı backend'de doğrula
                let user = try await networkService.fetchProfile()
                self.currentUser = user
                self.isAuthenticated = true
                print("[DEBUG][AuthViewModel] Token doğrulandı, kullanıcı: \(user.email)")
            } else {
                print("[DEBUG][AuthViewModel] Token bulunamadı")
                self.isAuthenticated = false
                self.currentUser = nil
            }
        } catch {
            print("[DEBUG][AuthViewModel] Token doğrulama hatası: \(error)")
            // Token geçersizse veya hata varsa, token'ı sil ve login ekranına yönlendir
            try? keychainService.deleteToken()
            self.isAuthenticated = false
            self.currentUser = nil
            self.error = "Oturum süresi doldu. Lütfen tekrar giriş yapın."
        }
        isLoading = false
    }
    
    func login(email: String, password: String) async {
        print("[DEBUG][AuthViewModel] login çağrıldı")
        isLoading = true
        error = nil
        
        do {
            let response = try await networkService.login(email: email, password: password)
            try keychainService.saveToken(response.token)
            currentUser = response.user
            isAuthenticated = true
            print("[DEBUG][AuthViewModel] login başarılı, kullanıcı: \(currentUser?.id ?? "-")")
        } catch {
            self.error = error.localizedDescription
            isAuthenticated = false // Hata durumunda ana ekrana geçişi engelle
            print("[DEBUG][AuthViewModel] login hata: \(error)")
        }
        
        isLoading = false
    }
    
    func register(email: String, password: String, firstName: String, lastName: String) async {
        print("[DEBUG][AuthViewModel] register çağrıldı")
        isLoading = true
        error = nil
        
        do {
            let response = try await networkService.register(email: email, password: password, firstName: firstName, lastName: lastName)
            try keychainService.saveToken(response.token)
            currentUser = response.user
            isAuthenticated = true
            print("[DEBUG][AuthViewModel] register başarılı")
        } catch {
            self.error = error.localizedDescription
            print("[DEBUG][AuthViewModel] register hata: \(error)")
        }
        
        isLoading = false
    }
    
    func logout() {
        print("[DEBUG][AuthViewModel] logout çağrıldı")
        do {
            try keychainService.deleteToken()
            isAuthenticated = false
            currentUser = nil
            print("[DEBUG][AuthViewModel] logout başarılı")
        } catch {
            self.error = error.localizedDescription
            print("[DEBUG][AuthViewModel] logout hata: \(error)")
        }
    }
    
    func fetchProfile() async {
        print("[DEBUG][AuthViewModel] fetchProfile çağrıldı")
        do {
            let user = try await networkService.fetchProfile()
            await MainActor.run {
                self.currentUser = user
                self.error = nil
            }
            print("[DEBUG][AuthViewModel] fetchProfile başarılı")
        } catch {
            await MainActor.run {
                self.error = error.localizedDescription
            }
            print("[DEBUG][AuthViewModel] fetchProfile hata: \(error)")
        }
    }

    func updateProfile(email: String, firstName: String, lastName: String, password: String, imageData: Data?) async {
        print("[DEBUG][AuthViewModel] updateProfile çağrıldı")
        do {
            let user = try await networkService.updateProfile(email: email, firstName: firstName, lastName: lastName, password: password, imageData: imageData)
            await MainActor.run {
                self.currentUser = user
                self.error = nil
            }
            print("[DEBUG][AuthViewModel] updateProfile başarılı")
        } catch {
            await MainActor.run {
                self.error = error.localizedDescription
            }
            print("[DEBUG][AuthViewModel] updateProfile hata: \(error)")
        }
    }
} 
