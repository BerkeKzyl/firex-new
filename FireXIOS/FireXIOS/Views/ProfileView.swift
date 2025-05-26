import SwiftUI
import PhotosUI

struct ProfileView: View {
    @EnvironmentObject var viewModel: AuthViewModel
    @State private var email: String = ""
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var password: String = ""
    @State private var isEditing = false
    @State private var selectedImage: PhotosPickerItem? = nil
    @State private var profileImage: Image? = nil
    @State private var imageData: Data? = nil
    @State private var isLoading = false
    @State private var errorMessage: String? = nil
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    VStack(spacing: 12) {
                        if let profileImage = profileImage {
                            profileImage
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 100, height: 100)
                                .clipShape(Circle())
                                .accessibilityLabel("Profile Image")
                        } else {
                            Circle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(width: 100, height: 100)
                                .overlay(Text("Add Photo").font(.caption))
                                .accessibilityLabel("Add Profile Photo")
                        }
                        PhotosPicker(selection: $selectedImage, matching: .images) {
                            Text("Change Photo")
                                .font(.system(size: 15, weight: .semibold))
                                .frame(minWidth: 100, minHeight: 44)
                                .foregroundColor(.blue)
                                .background(Color(.systemGray6))
                                .cornerRadius(10)
                                .accessibilityLabel("Change Profile Photo")
                        }
                        .disabled(!isEditing)
                        .opacity(isEditing ? 1 : 0.5)
                        .onChange(of: selectedImage) {
                            if let newItem = selectedImage {
                                Task {
                                    if let data = try? await newItem.loadTransferable(type: Data.self),
                                       let uiImage = UIImage(data: data) {
                                        self.profileImage = Image(uiImage: uiImage)
                                        self.imageData = data
                                    }
                                }
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                }
                Section(header: Text("Profile")) {
                    if isEditing {
                        VStack(spacing: 12) {
                            TextField("Email", text: $email)
                                .font(.system(size: 17))
                                .frame(height: 44)
                                .accessibilityLabel("Email")
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                            TextField("First Name", text: $firstName)
                                .font(.system(size: 17))
                                .frame(height: 44)
                                .accessibilityLabel("First Name")
                            TextField("Last Name", text: $lastName)
                                .font(.system(size: 17))
                                .frame(height: 44)
                                .accessibilityLabel("Last Name")
                            SecureField("Password", text: $password)
                                .font(.system(size: 17))
                                .frame(height: 44)
                                .accessibilityLabel("Password")
                            if let error = errorMessage {
                                Text(error)
                                    .foregroundColor(.red)
                                    .font(.footnote)
                            }
                            HStack(spacing: 16) {
                                Button(action: {
                                    isLoading = true
                                    errorMessage = nil
                                    Task {
                                        await viewModel.updateProfile(email: email, firstName: firstName, lastName: lastName, password: password, imageData: imageData)
                                        await viewModel.fetchProfile()
                                        isEditing = false
                                        isLoading = false
                                    }
                                }) {
                                    if isLoading {
                                        ProgressView()
                                            .frame(maxWidth: .infinity, minHeight: 44)
                                    } else {
                                        Text("Save")
                                            .frame(maxWidth: .infinity, minHeight: 44)
                                    }
                                }
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                                Button(action: {
                                    isEditing = false
                                    errorMessage = nil
                                    // Reset fields to current user values
                                    if let user = viewModel.currentUser {
                                        email = user.email
                                        firstName = user.firstName ?? ""
                                        lastName = user.lastName ?? ""
                                        if let base64 = user.profileImage,
                                           let data = Data(base64Encoded: base64),
                                           let uiImage = UIImage(data: data) {
                                            self.profileImage = Image(uiImage: uiImage)
                                        } else {
                                            self.profileImage = nil
                                        }
                                    }
                                }) {
                                    Text("Cancel")
                                        .frame(maxWidth: .infinity, minHeight: 44)
                                        .background(Color(.systemGray5))
                                        .foregroundColor(.orange)
                                        .cornerRadius(10)
                                }
                            }
                        }
                    } else {
                        VStack(spacing: 12) {
                            HStack {
                                Text("Email")
                                Spacer()
                                Text(email).foregroundColor(.gray)
                            }
                            HStack {
                                Text("First Name")
                                Spacer()
                                Text(firstName).foregroundColor(.gray)
                            }
                            HStack {
                                Text("Last Name")
                                Spacer()
                                Text(lastName).foregroundColor(.gray)
                            }
                            HStack {
                                Text("Password")
                                Spacer()
                                Text("••••••••").foregroundColor(.gray)
                            }
                            Button(action: {
                                isEditing = true
                                // Pre-fill fields with current values
                                if let user = viewModel.currentUser {
                                    email = user.email
                                    firstName = user.firstName ?? ""
                                    lastName = user.lastName ?? ""
                                    if let base64 = user.profileImage,
                                       let data = Data(base64Encoded: base64),
                                       let uiImage = UIImage(data: data) {
                                        self.profileImage = Image(uiImage: uiImage)
                                    } else {
                                        self.profileImage = nil
                                    }
                                }
                            }) {
                                Text("Edit")
                                    .frame(maxWidth: .infinity, minHeight: 44)
                                    .background(Color.orange)
                                    .foregroundColor(.white)
                                    .cornerRadius(10)
                            }
                        }
                    }
                }
                Section {
                    Button("Logout") {
                        viewModel.logout()
                    }
                    .frame(maxWidth: .infinity, minHeight: 44)
                    .font(.system(size: 17, weight: .semibold))
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .accessibilityLabel("Logout")
                }
            }
            .navigationTitle("Profile")
            .onAppear {
                if let user = viewModel.currentUser {
                    email = user.email
                    firstName = user.firstName ?? ""
                    lastName = user.lastName ?? ""
                    if let base64 = user.profileImage,
                       let data = Data(base64Encoded: base64),
                       let uiImage = UIImage(data: data) {
                        self.profileImage = Image(uiImage: uiImage)
                    } else {
                        self.profileImage = nil
                    }
                }
            }
        }
    }
} 