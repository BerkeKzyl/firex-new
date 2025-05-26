import SwiftUI

struct MainTabView: View {
    init() {
        UITabBar.appearance().unselectedItemTintColor = UIColor.gray
        UITabBar.appearance().backgroundColor = UIColor.systemBackground
    }
    var body: some View {
        TabView {
            MapView()
                .tabItem {
                    Label("Map", systemImage: "map")
                        .font(.system(size: 15, weight: .bold))
                        .frame(minWidth: 44, minHeight: 44)
                }
            ReportView()
                .tabItem {
                    Label("Report", systemImage: "flame")
                        .font(.system(size: 15, weight: .bold))
                        .frame(minWidth: 44, minHeight: 44)
                }
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.crop.circle")
                        .font(.system(size: 15, weight: .bold))
                        .frame(minWidth: 44, minHeight: 44)
                }
        }
        .accentColor(.orange) // High contrast for selected tab
    }
}
