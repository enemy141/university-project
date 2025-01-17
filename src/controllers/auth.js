import User from '../models/User';

/**
 * @desc Login a user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ status: true, user, token });
  } catch (e) {
    res
      .status(200)
      .send({ status: false, message: 'You have entered an invalid email or password' });
  }
};

export const verifyToken = async (req,res) => {
  const {user} = req;
  res.status(200).json({status : true,data: user})
}

/**
 * @desc Logout a user
 */
export const logout = async (req, res) => {
  const { user } = req;
  try {
    user.tokens = user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await user.save();
    res.status(200).send({status : true, message: 'You have successfully logged out!' });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * @desc Logout a user from all devices
 */
export const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'You have successfully logged out!' });
  } catch (e) {
    res.status(400).send(e);
  }
};
