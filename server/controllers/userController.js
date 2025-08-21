import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ Correct key from Clerk's auth

    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching published creations:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch creations." });
  }
};

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    // Pass JS array directly to update PostgreSQL text[]
    await sql`
      UPDATE creations
      SET likes = ${updatedLikes}
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    console.error("Toggle like error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};