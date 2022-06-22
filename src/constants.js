const PROFILE_TYPES = {
    CLIENT: 'client',
    CONTRACTOR: 'contractor'
};

const JOB_STATUSES = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    TERMINATED: 'terminated'
};

const PROFILE_SCOPE = {
    client: 'ClientId', 
    contractor: 'ContractorId'
};


module.exports = {
    PROFILE_TYPES,
    JOB_STATUSES,
    PROFILE_SCOPE
};