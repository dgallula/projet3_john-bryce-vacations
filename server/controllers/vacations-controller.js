import express from "express";
import vacationsBl from "../business-logic/vacations-bl.js";
import generalSetting from "../common/config.js";
import { checkResultStatus, upload } from "../common/helper.js";

const vacationsRouter = express.Router();

vacationsRouter.get(`${generalSetting.baseUrl}/vacations`, async (req, res) => {
  const getResult = await vacationsBl.getAll();
  if (!checkResultStatus(getResult)) {
    return res.status(500).send(getResult);
  } else {
    return res.send(getResult.data);
  }
});

vacationsRouter.get(
  `${generalSetting.baseUrl}/vacations/:id`,
  async (req, res) => {
    const id = req.params.id;
    const getVecationResult = await vacationsBl.getBy(id);

    if (!checkResultStatus(getVecationResult)) {
      return res.status(500).send(getVecationResult);
    } else {
      return res.send(getVecationResult.data);
    }
  }
);

vacationsRouter.get(
  `${generalSetting.baseUrl}/group-vacations-followers`,
  async (req, res) => {
    const getFollowersResult = await vacationsBl.getNumOfVacationsFollowers();
    if (!checkResultStatus(getFollowersResult)) {
      return res.status(500).send(getFollowersResult);
    } else {
      return res.send(getFollowersResult.data);
    }
  }
);

vacationsRouter.get(
  `${generalSetting.baseUrl}/vacations-followers`,
  async (req, res) => {
    const getFollowersResult = await vacationsBl.getFollowers();
    if (!checkResultStatus(getFollowersResult)) {
      return res.status(500).send(getFollowersResult);
    } else {
      return res.send(getFollowersResult.data);
    }
  }
);

vacationsRouter.post(
  `${generalSetting.baseUrl}/vacations`,
  async (req, res) => {
    const body = req.body;
    const postResult = await vacationsBl.addVacation(body);
    if (!checkResultStatus(postResult)) {
      return res.status(500).send(postResult);
    } else {
      postResult.data = {
        id: postResult.data.insertId,
        ...body,
      };
      return res.send(postResult.data);
    }
  }
);

vacationsRouter.put(
  `${generalSetting.baseUrl}/vacations/:id`,
  async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const updateResult = await vacationsBl.updateVacation(id, body);
    if (!checkResultStatus(updateResult)) {
      return res.status(500).send(updateResult);
    } else {
      updateResult.data = {
        id,
        ...body,
      };
      return res.send(updateResult.data);
    }
  }
);

vacationsRouter.post(
  `${generalSetting.baseUrl}/vacations-followers`,
  async (req, res) => {
    const { user, vacation } = req.body;
    const postFollowerResult = await vacationsBl.addNewFollower(
      +user,
      +vacation
    );
    if (!checkResultStatus(postFollowerResult)) {
      return res.status(500).send(postFollowerResult);
    } else {
      postFollowerResult.data = {
        id: postFollowerResult.data.insertId,
        ...req.body,
      };
      return res.send(postFollowerResult.data);
    }
  }
);

vacationsRouter.delete(
  `${generalSetting.baseUrl}/vacations/:id`,
  async (req, res) => {
    const vacationIdToDelete = req.params.id;
    const deleteResult = await vacationsBl.deleteVacation(vacationIdToDelete);
    if (!checkResultStatus(deleteResult)) {
      return res.status(500).send(deleteResult);
    } else {
      return res.send(deleteResult);
    }
  }
);

vacationsRouter.delete(
  `${generalSetting.baseUrl}/vacations-followers`,
  async (req, res) => {
    const { vacationId, userId } = req.body;
    const deleteResult = await vacationsBl.deleteFollower(vacationId, userId);
    if (!checkResultStatus(deleteResult)) {
      return res.status(500).send(deleteResult);
    } else {
      return res.send(deleteResult);
    }
  }
);

vacationsRouter.post(
  `${generalSetting.baseUrl}/vacation-image`,
  upload.single("file"),
  (req, res) => {
    res.json({ url: `${upload.getDestination}` + upload.getFilename });
  }
);

export default vacationsRouter;
