/**
 * Normalizes backend response from GET /api/v1/analytics/users into UI-ready structured data.
 * Computes all summary metrics, table breakdown rows, percentage shares, and chart datasets.
 * Keeps values raw and numeric without string formatting.
 */

export const normalizeUsersData = (rawPayload) => {
  if (!rawPayload) {
    return {
      summary: {
        totalUsers: 0,
        iosUsers: 0,
        androidUsers: 0,
        maleUsers: 0,
        femaleUsers: 0,
        otherUsers: 0,
        iosSharePercent: 0,
        androidSharePercent: 0,
        maleSharePercent: 0,
        femaleSharePercent: 0,
        otherSharePercent: 0
      },
      users: [],
      charts: {
        platformDistribution: [],
        genderDistribution: [],
        crossDistribution: []
      },
      isEmpty: true
    };
  }

  const data = rawPayload.data || rawPayload;
  const ios = data.ios || {};
  const android = data.android || {};

  const iosMale = Number(ios.male || 0);
  const iosFemale = Number(ios.female || 0);
  const iosOther = Number(ios.other || 0);

  const androidMale = Number(android.male || 0);
  const androidFemale = Number(android.female || 0);
  const androidOther = Number(android.other || 0);

  const iosUsers = iosMale + iosFemale + iosOther;
  const androidUsers = androidMale + androidFemale + androidOther;

  const maleUsers = iosMale + androidMale;
  const femaleUsers = iosFemale + androidFemale;
  const otherUsers = iosOther + androidOther;

  const totalUsers = iosUsers + androidUsers;

  const calcPercent = (val, base) => (base > 0 ? Number(((val / base) * 100).toFixed(2)) : 0);

  const iosSharePercent = calcPercent(iosUsers, totalUsers);
  const androidSharePercent = calcPercent(androidUsers, totalUsers);

  const maleSharePercent = calcPercent(maleUsers, totalUsers);
  const femaleSharePercent = calcPercent(femaleUsers, totalUsers);
  const otherSharePercent = calcPercent(otherUsers, totalUsers);

  // Tabular Breakdown Rows (Raw numeric values)
  const users = [
    {
      id: 'ios-male',
      platform: 'iOS',
      gender: 'Male',
      count: iosMale,
      platformSharePercent: calcPercent(iosMale, iosUsers),
      totalSharePercent: calcPercent(iosMale, totalUsers)
    },
    {
      id: 'ios-female',
      platform: 'iOS',
      gender: 'Female',
      count: iosFemale,
      platformSharePercent: calcPercent(iosFemale, iosUsers),
      totalSharePercent: calcPercent(iosFemale, totalUsers)
    },
    {
      id: 'ios-other',
      platform: 'iOS',
      gender: 'Other',
      count: iosOther,
      platformSharePercent: calcPercent(iosOther, iosUsers),
      totalSharePercent: calcPercent(iosOther, totalUsers)
    },
    {
      id: 'android-male',
      platform: 'Android',
      gender: 'Male',
      count: androidMale,
      platformSharePercent: calcPercent(androidMale, androidUsers),
      totalSharePercent: calcPercent(androidMale, totalUsers)
    },
    {
      id: 'android-female',
      platform: 'Android',
      gender: 'Female',
      count: androidFemale,
      platformSharePercent: calcPercent(androidFemale, androidUsers),
      totalSharePercent: calcPercent(androidFemale, totalUsers)
    },
    {
      id: 'android-other',
      platform: 'Android',
      gender: 'Other',
      count: androidOther,
      platformSharePercent: calcPercent(androidOther, androidUsers),
      totalSharePercent: calcPercent(androidOther, totalUsers)
    }
  ];

  // Precomputed Chart Datasets for Recharts
  const charts = {
    platformDistribution: [
      { name: 'iOS', value: iosUsers, percentage: iosSharePercent },
      { name: 'Android', value: androidUsers, percentage: androidSharePercent }
    ],
    genderDistribution: [
      { name: 'Male', value: maleUsers, percentage: maleSharePercent },
      { name: 'Female', value: femaleUsers, percentage: femaleSharePercent },
      { name: 'Other', value: otherUsers, percentage: otherSharePercent }
    ],
    crossDistribution: [
      { gender: 'Male', iOS: iosMale, Android: androidMale },
      { gender: 'Female', iOS: iosFemale, Android: androidFemale },
      { gender: 'Other', iOS: iosOther, Android: androidOther }
    ]
  };

  return {
    summary: {
      totalUsers,
      iosUsers,
      androidUsers,
      maleUsers,
      femaleUsers,
      otherUsers,
      iosSharePercent,
      androidSharePercent,
      maleSharePercent,
      femaleSharePercent,
      otherSharePercent
    },
    users,
    charts,
    isEmpty: totalUsers === 0
  };
};
