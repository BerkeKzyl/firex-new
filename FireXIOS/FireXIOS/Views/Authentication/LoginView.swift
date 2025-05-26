import SwiftUI

struct LoginView: View {
    @EnvironmentObject var viewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showingRegister = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 28) {
                Text("FireX")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.orange)
                    .accessibilityAddTraits(.isHeader)
                
                VStack(spacing: 18) {
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Email Address")
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.password)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Password")
                }
                .padding(.horizontal)
                
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Button(action: {
                        Task {
                            await viewModel.login(email: email, password: password)
                        }
                    }) {
                        Text("Sign In")
                            .frame(maxWidth: .infinity, minHeight: 44)
                            .font(.system(size: 17, weight: .semibold))
                            .background(Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                            .accessibilityLabel("Sign In")
                    }
                    .padding(.horizontal)
                    
                    Button("Create Account") {
                        showingRegister = true
                    }
                    .foregroundColor(.orange)
                    .frame(minHeight: 44)
                    .accessibilityLabel("Create Account")
                }
                
                if let error = viewModel.error {
                    Text(error)
                        .foregroundColor(.red)
                        .font(.caption)
                        .accessibilityLabel("Error: \(error)")
                }
            }
            .padding()
            .navigationBarHidden(true)
            .sheet(isPresented: $showingRegister) {
                RegisterView().environmentObject(viewModel)
            }
            .fullScreenCover(isPresented: $viewModel.isAuthenticated) {
                MainTabView().environmentObject(viewModel)
            }
        }
    }
} 
