import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Role = {
    #admin;
    #ustadz;
    #santri;
  };

  public type UserProfile = {
    name : Text;
    idSantri : Text;
    kelas : ?Text;
    role : Role;
  };

  let accessControlState = AccessControl.initState();
  let profiles = Map.empty<Principal, UserProfile>();
  include MixinAuthorization(accessControlState);

  // Helper function to map custom roles to AccessControl roles
  private func mapToAccessControlRole(role : Role) : AccessControl.UserRole {
    switch (role) {
      case (#admin) { #admin };
      case (#ustadz) { #user };
      case (#santri) { #user };
    };
  };

  // Required function: Get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    profiles.get(caller);
  };

  // Required function: Get any user's profile (with authorization)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Required function: Save caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    
    // Verify role consistency - users cannot change their own role to admin
    switch (profiles.get(caller)) {
      case (?existing) {
        if (existing.role == #admin and profile.role != #admin) {
          Runtime.trap("Unauthorized: Cannot demote yourself from admin");
        };
        if (existing.role != #admin and profile.role == #admin) {
          Runtime.trap("Unauthorized: Cannot promote yourself to admin");
        };
      };
      case (null) {
        // New profile - cannot self-assign admin role
        if (profile.role == #admin) {
          Runtime.trap("Unauthorized: Cannot self-assign admin role");
        };
      };
    };
    
    profiles.add(caller, profile);
  };

  // Admin function: Add a new user
  public shared ({ caller }) func tambahUser(user : Principal, profile : UserProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can manage users");
    };
    if (profiles.containsKey(user)) {
      Runtime.trap("User already exists");
    };
    
    // Assign role in AccessControl system
    let acRole = mapToAccessControlRole(profile.role);
    AccessControl.assignRole(accessControlState, caller, user, acRole);
    
    profiles.add(user, profile);
  };

  // Admin function: Edit existing user
  public shared ({ caller }) func editUser(user : Principal, updatedProfile : UserProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit users");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?existing) {
        // Update role in AccessControl system if role changed
        if (existing.role != updatedProfile.role) {
          let acRole = mapToAccessControlRole(updatedProfile.role);
          AccessControl.assignRole(accessControlState, caller, user, acRole);
        };
        profiles.add(user, updatedProfile);
      };
    };
  };

  // Admin function: Delete user
  public shared ({ caller }) func hapusUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };
    
    // Prevent deleting yourself
    if (caller == user) {
      Runtime.trap("Cannot delete your own account");
    };
    
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?_existing) {
        profiles.remove(user);
      };
    };
  };

  // Admin or self: Get specific user profile
  public query ({ caller }) func dapatkanProfil(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access own profile");
    };
    profiles.get(user);
  };

  // Admin only: Get all users
  public query ({ caller }) func dapatkanSemuaUser() : async [(Principal, UserProfile)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    profiles.toArray();
  };

  // Ustadz and Admin: Get all Santri profiles (for viewing attendance)
  public query ({ caller }) func dapatkanSemuaSantri() : async [(Principal, UserProfile)] {
    // Check if caller is authenticated
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view santri list");
    };
    
    // Check if caller is Ustadz or Admin
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.role != #ustadz and profile.role != #admin) {
          Runtime.trap("Unauthorized: Only Ustadz and Admin can view santri list");
        };
      };
    };
    
    // Filter and return only Santri profiles
    let allProfiles = profiles.toArray();
    allProfiles.filter(func((_, profile)) { profile.role == #santri });
  };

  // Santri only: Verify santri can submit attendance (authorization check)
  public query ({ caller }) func verifySantriAccess() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return false;
    };
    
    switch (profiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.role == #santri };
    };
  };
};
