import axios from "axios";

export const getMonthlyJoined = async () => {
    try {
        const res = await axios.get("http://localhost:4000/members/monthly-member", { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
        return { members: [] };
    }
};

export const threeDayExpire = async () => {
    try {
        const res = await axios.get("http://localhost:4000/members/within-3-days-expiring", { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
        return { members: [] };
    }
};

export const fourToSevenExpire = async () => {
    try {
        const res = await axios.get("http://localhost:4000/members/within-4-7-expiring", { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
        return { members: [] };
    }
};

export const getExpiredMembers = async () => {
    try {
        const res = await axios.get("http://localhost:4000/members/expired-member", { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
        return { members: [] };
    }
};

export const getInactiveMembers = async () => {
    try {
        const res = await axios.get("http://localhost:4000/members/inactive-member", { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
        return { members: [] };
    }
};
