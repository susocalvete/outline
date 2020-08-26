// @flow
import Router from "koa-router";
import auth from "../middlewares/authentication";
import { Document, Comment, Event } from "../models";
import policy from "../policies";
import { presentComment } from "../presenters";
import pagination from "./middlewares/pagination";

const { authorize } = policy;
const router = new Router();

router.post("comments.create", auth(), async (ctx) => {
  const { documentId, parentDocumentId, text } = ctx.body;
  ctx.assertUuid(documentId, "documentId is required");
  ctx.assertPresent(text, "text is required");

  if (parentDocumentId) {
    ctx.assertUuid(parentDocumentId, "parentDocumentId must be a uuid");
  }

  const user = ctx.state.user;
  authorize(user, "create", Comment);

  const comment = await Comment.create({
    text,
    parentDocumentId,
    documentId,
    createdById: user.id,
  });

  await Event.create({
    name: "comments.create",
    modelId: comment.id,
    documentId,
    teamId: user.teamId,
    actorId: user.id,
    ip: ctx.request.ip,
  });

  ctx.body = {
    data: presentComment(comment),
  };
});

router.post("comments.list", auth(), pagination(), async (ctx) => {
  const { sort = "createdAt", documentId } = ctx.body;
  ctx.assertUuid(documentId, "documentId is required");

  let direction = ctx.body.direction;
  if (direction !== "ASC") direction = "DESC";
  const user = ctx.state.user;

  const document = await Document.findByPk(documentId);
  authorize(user, "read", document);

  const comments = await Comment.findAll({
    where: { documentId },
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit,
  });

  ctx.body = {
    pagination: ctx.state.pagination,
    data: comments.map(presentComment),
  };
});

export default router;
