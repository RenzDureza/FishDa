import * as adminService from "../services/admin.services.js"

export const showUsers = async (req, res) => {
	try {
		const userID = await adminService.showUsers()

		if (userID.length > 0) {
			res.status(200).json(userID);
		} else {
			res.status(404).json({ message: "No Item found" });
		}
	} catch (err) {
		res.status(500).json({
			message: "hi"
		});
	}
}
