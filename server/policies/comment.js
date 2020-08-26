// @flow
import { Comment, User } from "../models";
import policy from "./policy";

const { allow } = policy;

allow(User, "create", Comment);
