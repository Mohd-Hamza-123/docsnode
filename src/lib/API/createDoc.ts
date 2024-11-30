import { I_Docs } from "@/app/create-docs/page";
import conf from "@/conf/conf";
import axios from "axios";

export const createDoc = async (doc: I_Docs) => {
    console.log(doc)
    const res = await axios.post(`${conf.api_end_point}/api/docs`, doc);
    if (res.data?.success) {
        return res.data?.payload
    }
    return null
};

export const updateDoc = async (doc: I_Docs, _id: string) => {
    const res = await axios.put(
        `${conf.api_end_point}api/docs/${_id}`, doc);
    if (res.data?.success) {
        return res.data?.payload
    }
    return null
}