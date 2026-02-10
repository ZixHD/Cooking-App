import User from "@/models/User";
import { fetchUserById, updateUser } from "@/services/AxiosUser";
import { getToken } from "@/utils/AuthMiddleware";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";



const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

 

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("123123")
        const token = await getToken("jwt")
        console.log("token ", token)
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded.sub
        
        const data = await fetchUserById(userId);

        setUser({
            id: data.id,                    
            username: data.username,
            email: data.email,
            password: data.password || "",   
            avatar: data.avatar || "https://example.com/default-avatar.png", 
            preferred_tags: data.preferred_tags || [],
            preferred_cuisine: data.preferred_cuisine || [],
            allergies: data.allergies || [],
            favorites: data.favorites || [],
        } as User);
      } catch (err) {
        console.log("Failed to fetch user:", err);
      }
    };

    loadUser();
  }, []);

   const handleChange = (key: keyof User, value: any) => {
    if (!user) return;
    setUser({ ...user, [key]: value });
  };

  const handleSave = async () => {
  if (!user) return;
  const updatedData: Partial<User> = {
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    preferred_tags: user.preferred_tags,
    preferred_cuisine: user.preferred_cuisine,
    allergies: user.allergies,
  };
  try {
    const updated = await updateUser(user.id, updatedData);
    setUser(updated);
    alert("Profile saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to save profile");
  }
};

  if (!user) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={{ uri: user.avatar || DEFAULT_AVATAR }}
          onError={() => handleChange("avatar", DEFAULT_AVATAR)}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 10,
          }}
        />

        {editing && (
          <TextInput
            placeholder="Avatar URL"
            value={user.avatar}
            onChangeText={(v) => handleChange("avatar", v)}
            style={{
              borderWidth: 1,
              padding: 8,
              width: "80%",
              borderRadius: 8,
            }}
          />
        )}
      </View>

      <Text>Username</Text>
      <TextInput
        value={user.username}
        editable={editing}
        onChangeText={(v) => handleChange("username", v)}
        style={styles.input}
      />

      <Text>Email</Text>
      <TextInput
        value={user.email}
        editable={editing}
        onChangeText={(v) => handleChange("email", v)}
        style={styles.input}
      />

      <Text>Preferred Tags</Text>
      <TextInput
        value={user.preferred_tags.join(", ")}
        editable={editing}
        onChangeText={(v) =>
          handleChange("preferred_tags", v.split(",").map(s => s.trim()))
        }
        style={styles.input}
      />

      <Text>Preferred Cuisine</Text>
      <TextInput
        value={user.preferred_cuisine.join(", ")}
        editable={editing}
        onChangeText={(v) =>
          handleChange("preferred_cuisine", v.split(",").map(s => s.trim()))
        }
        style={styles.input}
      />

      <Text>Allergies</Text>
      <TextInput
        value={user.allergies.join(", ")}
        editable={editing}
        onChangeText={(v) =>
          handleChange("allergies", v.split(",").map(s => s.trim()))
        }
        style={styles.input}
      />

      <Text>Favorites</Text>
      <Text>{user.favorites.length} recipes</Text>

      <TouchableOpacity
        onPress={async () => {
            if (editing) await handleSave();
            setEditing(!editing);
        }}
        style={styles.button}
        >
        <Text style={{ color: "white" }}>
            {editing ? "Save" : "Edit Profile"}
        </Text>
    </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center" as const,
    marginTop: 10,
  },
};

export default Profile;
