exports.read = (req, res) => {
    // to prevent the hash_password and salt to return as json response to client
    // we mark it as undefined
    // as req.profile has complete user data
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
