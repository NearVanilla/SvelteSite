export type StaffRole = 'admin' | 'moderator' | 'helper';

export interface StaffMember {
	name: string;
	since: string;
	tagline?: string;
	location?: string;
	timeZone?: string;
	quote?: string;
}

export interface StaffTier {
	role: StaffRole;
	label: string;
	members: StaffMember[];
}

export const staffTiers = [
	{
		role: 'admin',
		label: 'Admins',
		members: [
			{
				name: 'Prof_Bloodstone',
				since: '2018-08-13',
				tagline: 'Server Owner',
				location: 'Poland',
				timeZone: 'Europe/Paris',
				quote: 'Consider yourself lucky… or cursed.'
			},
			{
				name: '105hua',
				since: '2024-09-23',
				tagline: 'Tech Lead & Server Manager',
				location: 'United Kingdom',
				timeZone: 'Europe/London',
				quote: 'Most of what happens behind the scenes passes through here.'
			},
			{
				name: 'LoquaciousFox_',
				since: '2020-07-04',
				tagline: 'Community Leader',
				location: 'Canada',
				timeZone: 'America/New_York',
				quote: 'Jack of All Trades, master of… well, a few.'
			},
			{
				name: 'Sblod',
				since: '2024-10-02',
				tagline: 'Events Manager',
				location: 'Wales',
				timeZone: 'Europe/London',
				quote: 'Every great event starts with a spark.'
			}
		]
	},
	{
		role: 'moderator',
		label: 'Moderators',
		members: [
			{
				name: 'Biz_Block',
				since: '2022-01-08',
				tagline: 'Shopping District Maintainer',
				location: 'United States',
				timeZone: 'America/New_York',
				quote: 'Fairness is a block best placed carefully.'
			},
			{
				name: 'Demonstrations',
				since: '2022-01-08',
				tagline: 'Tech Team Member',
				location: 'Wales',
				timeZone: 'Europe/London',
				quote: 'Show, do not just tell.'
			},
			{
				name: 'Dynant',
				since: '2022-01-08',
				tagline: 'Tech Team Member',
				location: 'Netherlands',
				timeZone: 'Europe/Paris',
				quote: 'There is always more to discover.'
			},
			{
				name: 'kNaLLx',
				since: '2022-01-08',
				tagline: 'Shopping District Maintainer & Community Moderator',
				location: 'Norway',
				timeZone: 'Europe/Paris',
				quote: 'With enough redstone, anything is possible.'
			},
			{
				name: 'Lego_monkeyman',
				since: '2022-01-08',
				tagline: 'Shopping District Maintainer & Community Moderator',
				location: 'United Kingdom',
				timeZone: 'Europe/London',
				quote: 'Every block is a step toward something epic.'
			},
			{
				name: 'SuprGamr',
				since: '2022-01-08',
				tagline: 'Events Organiser',
				location: 'Sweden',
				timeZone: 'Europe/Paris',
				quote: 'May the best crafter win.'
			},
			{
				name: 'Muffinz',
				since: '2022-01-08',
				tagline: 'All-Rounder',
				location: 'Canada',
				timeZone: 'America/New_York',
				quote: 'Cats make everything better.'
			},
			{
				name: 'Toystory2wasok',
				since: '2022-01-08',
				tagline: 'Community Moderator',
				location: 'United States',
				timeZone: 'America/New_York',
				quote: 'Every player has a story worth telling.'
			},
			{
				name: 'VividLilyBug949',
				since: '2022-01-08',
				tagline: 'Onboarding & Community Moderator',
				location: 'United States',
				timeZone: 'America/New_York',
				quote: 'I didn’t fail, I just found 100 ways that don’t work.'
			}
		]
	},
	{
		role: 'helper',
		label: 'Helpers',
		members: [
			{
				name: 'HaakonASH',
				since: '2026-01-08',
				tagline: 'Community Helper',
				location: 'Norway',
				timeZone: 'Europe/Paris',
				quote: 'Every expert was once a beginner.'
			},
			{
				name: 'Nollita',
				since: '2026-01-08',
				tagline: 'Community Helper',
				location: 'Netherlands',
				timeZone: 'Europe/Paris',
				quote: 'A friendly hello goes a long way.'
			},
			{
				name: 'TaintedBird',
				since: '2026-01-08',
				tagline: 'Community Helper',
				location: 'United Kingdom',
				timeZone: 'Europe/London',
				quote: 'Free as a bird, helpful as a helper.'
			},
			{
				name: 'WiscoSippi',
				since: '2026-01-08',
				tagline: 'Sippin through life',
				location: 'United States',
				timeZone: 'America/Chicago',
				quote: 'Take it one sip at a time.'
			}
		]
	}
] satisfies StaffTier[];
