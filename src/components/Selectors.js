export const getHometown = member => member.addresses[0].addressLocality;

export const getDCAddress = member => member.addresses[1];
