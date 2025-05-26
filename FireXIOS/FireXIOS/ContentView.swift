import SwiftUI

struct ContentView: View {
    @EnvironmentObject var viewModel: AuthViewModel

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView("Yükleniyor...")
            } else if viewModel.isAuthenticated {
                MainTabView()
            } else {
                LoginView()
            }
        }
        .alert("Hata", isPresented: .constant(viewModel.error != nil)) {
            Button("Tamam") {
                viewModel.error = nil
            }
        } message: {
            if let error = viewModel.error {
                Text(error)
            }
        }
    }
}
