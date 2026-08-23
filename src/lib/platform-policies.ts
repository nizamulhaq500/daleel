import { PlatformPolicy, CodedTerm, SeverityLevel } from './types';

export const platformPolicies: Record<string, PlatformPolicy> = {
  meta: {
    platform: 'Meta (Facebook/Instagram)',
    reportingUrl: 'https://www.facebook.com/help/181495968648557',
    policySummary: 'Meta strictly prohibits hate speech, defined as direct attacks on people based on protected characteristics including religious affiliation. This includes violent or dehumanizing speech, harmful stereotypes, statements of inferiority, expressions of contempt, disgust or dismissal, cursing, and calls for exclusion or segregation.',
    relevantCategories: ['Hate Speech', 'Harassment', 'Violence and Incitement'],
    reportingInstructions: [
      'Navigate to the specific post, comment, or profile.',
      'Click the three dots (...) menu on the top right of the content.',
      'Select "Report post" or "Report comment".',
      'Choose "Hate speech" as the reason.',
      'Select the specific sub-category (e.g., Religious affiliation).'
    ],
    evidenceToInclude: [
      'Direct link to the content',
      'Screenshots of the content (in case it gets deleted)',
      'Timestamp of when the content was posted',
      'Context if the hate speech is coded or relies on dog whistles'
    ],
    expectedResponseTime: '24-48 hours',
    escalationOptions: [
      'Meta Oversight Board (if initial appeal is denied)',
      'Civil rights organizations (e.g., Muslim Advocates, CAIR)',
      'Submit to specialized trusted flagger programs if partnered'
    ]
  },
  youtube: {
    platform: 'YouTube',
    reportingUrl: 'https://support.google.com/youtube/answer/2801939',
    policySummary: 'YouTube does not allow hate speech. They remove content promoting violence or inciting hatred against individuals or groups based on attributes like religion. This covers slurs, stereotypes promoting hate, and dehumanizing language.',
    relevantCategories: ['Hate Speech', 'Harassment & Cyberbullying', 'Violent or Graphic Content'],
    reportingInstructions: [
      'Below the video player, click the three dots (...).',
      'Select "Report".',
      'Choose "Hate speech or graphic violence".',
      'Select the sub-category for "Promotes hatred or violence".',
      'Provide a timestamp where the hateful content occurs.'
    ],
    evidenceToInclude: [
      'Video URL',
      'Specific timestamps of violations',
      'Transcripts of the problematic speech',
      'Archived links of the video page'
    ],
    expectedResponseTime: '24-72 hours',
    escalationOptions: [
      'YouTube Creator Support (if you are a partner)',
      'Escalation via specialized NGO networks (Trusted Flaggers)',
      'Public pressure or media outreach for high-profile violations'
    ]
  },
  tiktok: {
    platform: 'TikTok',
    reportingUrl: 'https://support.tiktok.com/en/safety-hc/report-a-problem',
    policySummary: 'TikTok\'s Community Guidelines strictly prohibit hate speech and hateful ideologies. This includes content that attacks, threatens, incites violence against, or dehumanizes an individual or group based on protected attributes, including religion.',
    relevantCategories: ['Hate speech and hateful behaviors', 'Harassment and bullying'],
    reportingInstructions: [
      'Long-press on the video or tap the Share arrow.',
      'Select "Report".',
      'Choose "Hate speech and hateful behaviors".',
      'Submit the report.'
    ],
    evidenceToInclude: [
      'Video link',
      'Screenshots of captions or in-video text',
      'Explanation of coded audio/trends used to bypass filters'
    ],
    expectedResponseTime: '24 hours',
    escalationOptions: [
      'Report through the TikTok Safety Center web form for detailed appeals',
      'Engagement with digital rights organizations'
    ]
  },
  twitter: {
    platform: 'X (formerly Twitter)',
    reportingUrl: 'https://help.twitter.com/en/rules-and-policies/hateful-conduct-policy',
    policySummary: 'You may not directly attack other people on the basis of race, ethnicity, national origin, caste, sexual orientation, gender, gender identity, religious affiliation, age, disability, or serious disease. This includes dehumanizing language, hateful imagery, and incitement.',
    relevantCategories: ['Hateful conduct', 'Abuse/Harassment', 'Violent threats'],
    reportingInstructions: [
      'Click the three dots (...) on the specific post.',
      'Select "Report post".',
      'Follow the prompts and select "It\'s abusive or harmful".',
      'Choose "It directs hate against a protected category".'
    ],
    evidenceToInclude: [
      'Direct URL to the post',
      'Archive.org or archive.is link of the post',
      'Screenshots showing the post and the user\'s profile'
    ],
    expectedResponseTime: '48-72 hours',
    escalationOptions: [
      'Filing a detailed report via the X Help Center forms',
      'Tagging X Support if the issue is widespread network abuse',
      'Legal reporting in jurisdictions like the EU (DSA mechanisms)'
    ]
  },
  reddit: {
    platform: 'Reddit',
    reportingUrl: 'https://www.reddithelp.com/hc/en-us/articles/360045715951',
    policySummary: 'Reddit\'s Rule 1 states: "Remember the human. Reddit is a place for creating community and belonging, not for attacking marginalized or vulnerable groups of people. Everyone has a right to use Reddit free of harassment, bullying, and threats of violence."',
    relevantCategories: ['Hate', 'Harassment'],
    reportingInstructions: [
      'Click the "Report" button under the specific post or comment.',
      'Select "Hate".',
      'Submit the report. You can also report the user to the subreddit moderators.'
    ],
    evidenceToInclude: [
      'Permalink to the comment or post',
      'Context if part of a larger brigade or coordinated campaign',
      'Screenshots'
    ],
    expectedResponseTime: '24-48 hours',
    escalationOptions: [
      'Modmail to the specific subreddit moderators (faster response)',
      'Report to Reddit Admins via reddit.com/report for sitewide violations'
    ]
  },
  discord: {
    platform: 'Discord',
    reportingUrl: 'https://dis.gd/report',
    policySummary: 'Discord prohibits organizing, promoting, or supporting hate speech. Users may not share content that attacks or demeans a group based on protected characteristics like religion. Servers dedicated to hateful ideologies are banned.',
    relevantCategories: ['Hate Speech', 'Harassment', 'Violent Extremism'],
    reportingInstructions: [
      'Right-click the message and copy the Message ID (requires Developer Mode).',
      'Copy the User ID and Server ID.',
      'Go to the Discord Trust & Safety request center (dis.gd/report).',
      'Submit a ticket with all IDs and context.'
    ],
    evidenceToInclude: [
      'Message IDs, User IDs, Server IDs (critical)',
      'Direct links to messages',
      'Explanation of the context or server purpose'
    ],
    expectedResponseTime: '3-5 days',
    escalationOptions: [
      'Server administrators (if the server is not inherently hateful)',
      'Law enforcement if there are credible, imminent threats of violence'
    ]
  },
  telegram: {
    platform: 'Telegram',
    reportingUrl: 'https://telegram.org/faq#q-there-39s-illegal-content-on-telegram-how-do-i-take-it-down',
    policySummary: 'Telegram prohibits public channels or bots that promote violence. However, they generally do not police private chats. Hate speech reporting is primarily effective for public channels inciting violence.',
    relevantCategories: ['Violence', 'Illegal Content'],
    reportingInstructions: [
      'In a public channel, tap or right-click the message.',
      'Select "Report".',
      'Choose "Violence" or "Other" to specify hate speech.',
      'Alternatively, email abuse@telegram.org with channel links.'
    ],
    evidenceToInclude: [
      'Public channel link (t.me/...)',
      'Specific message links',
      'Translations if the content is in a non-English language'
    ],
    expectedResponseTime: 'Varies widely (often unresponsive unless high profile)',
    escalationOptions: [
      'App store reporting (Apple/Google) for hosting violent channels',
      'Government/law enforcement intervention for credible threats'
    ]
  },
  whatsapp: {
    platform: 'WhatsApp',
    reportingUrl: 'https://faq.whatsapp.com/1142481766359885',
    policySummary: 'WhatsApp terms prohibit publishing falsehoods, engaging in illegal, threatening, intimidating, hateful, or racially/ethnically offensive behavior.',
    relevantCategories: ['Hateful conduct', 'Harassment'],
    reportingInstructions: [
      'Open the chat with the user.',
      'Tap their contact name or group name to open profile info.',
      'Scroll to the bottom and tap "Report contact" or "Report group".',
      'You can also long-press a specific message and select Report.'
    ],
    evidenceToInclude: [
      'WhatsApp forwards the last 5 messages to their review team when you report',
      'Keep your own screenshots for external escalation'
    ],
    expectedResponseTime: '24-48 hours for account review',
    escalationOptions: [
      'Local law enforcement for direct threats',
      'Fact-checking tiplines for viral misinformation'
    ]
  }
};
