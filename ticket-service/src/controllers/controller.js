

const createTicket = async (req, res, next) => {
    try {
        console.log("create", req.body);
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

export {createTicket}