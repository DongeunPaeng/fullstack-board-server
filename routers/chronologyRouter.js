const express = require("express");

const ChronologyService = require("../services/chronologyService");

const chronologyService = new ChronologyService();
const chronologyRouter = express.Router();

const getGroupedEvents = (events) => {
    return events.map((e) => {
        return { bucket: e.bucket, area: e.area, event: e.event };
    });
};

chronologyRouter.get("/", async (_, res) => {
    try {
        const events = await chronologyService.getEvents();
        const groupedEvents = getGroupedEvents(events);
        res.status(200).json({ groupedEvents });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

module.exports = chronologyRouter;
// TODO: 여기서 연산을 통해 10년 단위의 묶음으로 내려주자.
