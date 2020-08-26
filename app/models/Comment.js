// @flow
import BaseModel from "./BaseModel";

class Comment extends BaseModel {
  id: string;
  text: string;
  documentId: string;
  parentCommentId: string;
  createdById: string;
}

export default Comment;
