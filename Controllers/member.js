const Member = require('../Models/member')
const Membership = require('../Models/membership')

exports.getAllMember = async (req, res) => {
    try {
        const { skip, limit } = req.query;

        // console.log(skip,limit)
        const members = await Member.find({ gym: req.gym._id });
        const totalMember = members.length;

        // console.log(members);

        const limitedMembers = await Member.find({ gym: req.gym._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        // const limitedMembers = await Member.find({gym:req.gym._id}).sort({createdAt: -1}).skip(skip).limit(limit);

        res.status(200).json({
            message: members.length ? "Fetched Members SuccessFully" : "No any Member Registered yet",
            members: limitedMembers,
            totalMembers: totalMember
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' })

    }
}
function addMonthsToDate(months, joiningDate) {
    let today = joiningDate;

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    const futureMonth = currentMonth + months;
    const futureYear = currentYear + Math.floor(futureMonth / 12);
    const adjustedMonth = futureMonth % 12;

    const futureDate = new Date(futureYear, adjustedMonth, 1); // ✅ fixed variable name

    const lastDayOfFutureMonth = new Date(futureYear, adjustedMonth + 1, 0).getDate();
    const adjustedDay = Math.min(currentDate, lastDayOfFutureMonth);

    futureDate.setDate(adjustedDay);

    return futureDate;
}

exports.registerMember = async (req, res) => {
    try {
        const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;
        const member = await Member.findOne({ gym: req.gym._id, mobileNo });
        if (member) {
            return res.status(409).json({ error: 'Already registered with this Mobile No' });
        }
        const memberShip = await Membership.findOne({ _id: membership, gym: req.gym._id });
        const membershipMonths = memberShip.months;
        // console.log(memberShip);
        if (memberShip) {
            let jngDate = new Date(joiningDate);
            const nextBillDate = addMonthsToDate(membershipMonths, jngDate);
            let newMember = new Member({ name, mobileNo, address, membership, gym: req.gym._id, profilePic, nextBillDate });
            await newMember.save();

            res.status(200).json({
                message: "Member Registered Successfully",
                newMember
            })
        } else {
            return res.status(409).json({ error: "No such Membership are there" })
        }



    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.searchMember = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const member = await Member.find({
            gym: req.gym._id,
            $or: [{ name: { $regex: '^' + searchTerm, $options: 'i' } },
            { mobileNo: { $regex: '^' + searchTerm, $options: 'i' } }
            ]
        });
        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member Registered yet",
            members: member,
            totalMembers: member.length

        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}


exports.monthlyMember = async (req, res) => {
    try {
        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const member = await Member.find({
            gym: req.gym._id,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).sort({ createdAt: -1 });
        // console.log(startOfMonth,endOfMonth)
        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member Registered yet",
            members: member,
            totalMembers: member.length
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.expiringWithin3Days = async (req, res) => {
    try {

        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);

        const member = await Member.find({
            gym: req.gym._id,
            nextBillDate: {
                $gte: today,
                $lte: nextThreeDays
            }
        });


        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member is Expiring within 3 Days",
            members: member,
            totalMembers: member.length
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}


exports.expiringWithIn4to7Days = async (req, res) => {
    try {
        const today = new Date();
        const next4Days = new Date();
        next4Days.setDate(today.getDate() + 4);


        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);

        const member = await Member.find({
            gym: req.gym._id,
            nextBillDate: {
                $gte: next4Days,
                $lte: next7Days
            }
        });

        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member is Expiring within 4-7 Days",
            members: member,
            totalMembers: member.length
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.expiredMember = async (req, res) => {
    try {
        const today = new Date();
        const member = await Member.find({
            gym: req.gym._id, status: "Active",
            nextBillDate: {
                $lt: today
            }
        });

        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member has been Expired",
            members: member,
            totalMembers: member.length
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.inActiveMember = async (req, res) => {
    try {
        const member = await Member.find({ gym: req.gym._id, status: "Pending" });

        res.status(200).json({
            message: member.length ? "Fetched Members SuccessFully" : "No such Member is Pending",
            members: member,
            totalMembers: member.length
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}


exports.getMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findOne({ _id: id, gym: req.gym._id });
        if (!member) {
            return res.status(400).json({ error: 'No such Member' });
        }
        res.status(200).json({
            message: "Member Data Fetched",
            member: member
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const member = await Member.findOne({ _id: id, gym: req.gym._id });
        if (!member) {
            return res.status(400).json({ error: 'No such Member' });
        }
        member.status = status;
        await member.save();
        res.status(200).json({
            message: "Status Changed Successfully",
            // member: member

        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}

exports.updateMemberPlan = async (req, res) => {
    try {

        const { membership } = req.body;

        const { id } = req.params;
        const memberShip = await Membership.findOne({ gym:req.gym._id, _id: membership });

        if (memberShip) {
            let getMonth = memberShip.months;
            let today = new Date();
            let nextBillDate = addMonthsToDate(getMonth, today);
            const member = await Member.findOne({ gym: req.gym._id, _id:id });

            if (!member) {
                return res.status(409).json({ error: "No such Member found" });
            }
            member.nextBillDate = nextBillDate;
            member.lastPayment = today;

            await member.save();
            res.status(200).json({ message: "Member Renewed Successfully", member });
        }
        else {
            return res.status(409).json({ error: "No such Membership are there" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });

    }
}
