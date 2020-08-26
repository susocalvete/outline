// @flow
import invariant from "invariant";
import { action, runInAction } from "mobx";
import Comment from "models/Comment";
import BaseStore from "./BaseStore";
import RootStore from "./RootStore";
import type { PaginationParams } from "types";
import { client } from "utils/ApiClient";

export default class CommentsStore extends BaseStore<Comment> {
  actions = ["list", "create", "update", "delete"];

  constructor(rootStore: RootStore) {
    super(rootStore, Comment);
  }

  @action
  fetchDocumentComments = async (
    documentId: string,
    options: ?PaginationParams
  ): Promise<?(Document[])> => {
    this.isFetching = true;

    try {
      const res = await client.post(`/comments.list`, {
        documentId,
        ...options,
      });
      invariant(res && res.data, "Comment list not available");

      runInAction("CommentsStore#fetchDocumentComments", () => {
        res.data.forEach(this.add);
        this.addPolicies(res.policies);
      });
      return res.data;
    } finally {
      this.isFetching = false;
    }
  };
}
