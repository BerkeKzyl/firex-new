import SwiftUI

struct RegisterView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var globalAuthViewModel: AuthViewModel // Global AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 28) {
                Text("Create Account")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.orange)
                    .accessibilityAddTraits(.isHeader)
                
                VStack(spacing: 18) {
                    HStack {
                        Text("First Name")
                        Text("*").foregroundColor(.red)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    TextField("First Name", text: $firstName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.words)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("First Name")
                    HStack {
                        Text("Last Name")
                        Text("*").foregroundColor(.red)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    TextField("Last Name", text: $lastName)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.words)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Last Name")
                    HStack {
                        Text("Email")
                        Text("*").foregroundColor(.red)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Email Address")
                    HStack {
                        Text("Password")
                        Text("*").foregroundColor(.red)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.newPassword)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Password")
                    HStack {
                        Text("Confirm Password")
                        Text("*").foregroundColor(.red)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    SecureField("Confirm Password", text: $confirmPassword)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .textContentType(.newPassword)
                        .font(.system(size: 17))
                        .frame(height: 44)
                        .accessibilityLabel("Confirm Password")
                }
                .padding(.horizontal)
                
                if globalAuthViewModel.isLoading {
                    ProgressView()
                } else {
                    Button(action: {
                        // Alan kontrolleri
                        if firstName.isEmpty {
                            alertMessage = "First name is required."
                            showingAlert = true
                            return
                        }
                        if lastName.isEmpty {
                            alertMessage = "Last name is required."
                            showingAlert = true
                            return
                        }
                        if email.isEmpty {
                            alertMessage = "Email is required."
                            showingAlert = true
                            return
                        }
                        if password.isEmpty {
                            alertMessage = "Password is required."
                            showingAlert = true
                            return
                        }
                        if password != confirmPassword {
                            alertMessage = "Passwords do not match."
                            showingAlert = true
                            return
                        }
                        Task {
                            await globalAuthViewModel.register(email: email, password: password, firstName: firstName, lastName: lastName)
                            if globalAuthViewModel.isAuthenticated {
                                dismiss()
                            } else if let error = globalAuthViewModel.error {
                                alertMessage = error
                                showingAlert = true
                            }
                        }
                    }) {
                        Text("Create Account")
                            .frame(maxWidth: .infinity, minHeight: 44)
                            .font(.system(size: 17, weight: .semibold))
                            .background(Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                            .accessibilityLabel("Create Account")
                    }
                    .padding(.horizontal)
                }
                
                if let error = globalAuthViewModel.error {
                    Text(error)
                        .foregroundColor(.red)
                        .font(.caption)
                        .accessibilityLabel("Error: \(error)")
                }
            }
            .padding()
            .navigationBarItems(leading: Button("Cancel") {
                dismiss()
            }
            .foregroundColor(.orange)
            .frame(minHeight: 44)
            .accessibilityLabel("Cancel"))
            .alert("Error", isPresented: $showingAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(alertMessage)
            }
        }
    }
} 
