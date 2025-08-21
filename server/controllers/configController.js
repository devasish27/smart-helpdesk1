import Config from "../models/Config";

export const getConfig = async (req, res) => {
  let config = await Config.findOne();
  if (!config) {
    config = await Config.create({});
  }
  res.json(config);
};

export const updateConfig = async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = new Config();
  Object.assign(config, req.body);
  await config.save();
  res.json(config);
};
