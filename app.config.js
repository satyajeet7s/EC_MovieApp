import 'dotenv/config';

export default {
  expo: {
    name: "CMA",
    slug: "CMA",
    extra: {
      apiKey: process.env.API_KEY,
    },
  },
};
