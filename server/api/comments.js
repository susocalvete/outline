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
  const { documentId, parentCommentId, text } = ctx.body;
  ctx.assertUuid(documentId, "documentId is required");
  ctx.assertPresent(text, "text is required");

  if (parentCommentId) {
    ctx.assertUuid(parentCommentId, "parentCommentId must be a uuid");
  }

  const user = ctx.state.user;
  authorize(user, "create", Comment);

  const document = await Document.findByPk(documentId, { userId: user.id });
  authorize(user, "read", document);

  const comment = await Comment.create({
    text,
    parentCommentId,
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
    data: { parentCommentId },
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

  const document = await Document.findByPk(documentId, { userId: user.id });
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

// router.post("comments.update", auth(), async (ctx) => {
// router.post("comments.delete", auth(), async (ctx) => {
// router.post("comments.resolve", auth(), async (ctx) => {
// router.post("comments.unresolve", auth(), async (ctx) => {

export default router;
