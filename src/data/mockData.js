export const CQN_LIST = [
  'ISG-ESG-AMER-01', 'ISG-ESG-AMER-02', 'ISG-ESG-AMER-03',
  'ISG-ESG-EMEA-01', 'ISG-ESG-EMEA-02', 'ISG-ESG-EMEA-03',
  'ISG-ESG-APJ-01',  'ISG-ESG-APJ-02',  'ISG-ESG-APJ-03',
  'ISG-ESG-LATAM-01','ISG-ESG-LATAM-02',
]

export const PLAN_NAMES = ['AOP_FY26Q4_AA', 'FY27 Q1 APR Plan', 'FY27 Q2 JUN Plan', 'FY27Q1_AA']
export const FISCAL_YEARS = ['FY25', 'FY26', 'FY27']

// Fiscal Quarter filter options: FY25Q1 ... FY27Q4
export const FISCAL_QUARTERS = FISCAL_YEARS.flatMap(fy => ['Q1', 'Q2', 'Q3', 'Q4'].map(q => `${fy}${q}`))

// Chart drill data still buckets a year into 13 short weeks (W1..W13) — unrelated to the filter list below.
export const FISCAL_WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`)

// Fiscal Week filter options: FY25W01 ... FY27W52
export const FISCAL_WEEK_LIST = FISCAL_YEARS.flatMap(fy =>
  Array.from({ length: 52 }, (_, i) => `${fy}W${String(i + 1).padStart(2, '0')}`)
)

export const CHANNELS = ['Voice', 'Chat', 'Email', 'Social']
export const REGIONS = ['APJ', 'EMEA', 'Global', 'LATAM', 'NAMER']
export const COUNTRIES = {
  AMER: ['USA', 'Canada', 'Mexico', 'Brazil'],
  EMEA: ['UK', 'Germany', 'France', 'Netherlands', 'India'],
  APJ:  ['Japan', 'Australia', 'Singapore', 'China'],
  LATAM:['Argentina', 'Chile', 'Colombia'],
}

export const SUB_REGIONS = [
  'Australia', 'Brazil', 'CER', 'China', 'Costa Rica', 'EC', 'Egypt', 'EMEA', 'France',
  'Germany', 'Global', 'India', 'Israel', 'Japan', 'Korea', 'Multiple SubRegions',
  'Nordics', 'Panama', 'ROLA', 'SER', 'South Asia', 'UKI', 'United Kingdom', 'United States',
]

export const L5_MANAGERS = [
  'Banthia, Nishant', 'Brown, Dexter', 'Carey, Geraldine', 'Christmas, James',
  'Copeland, Jessica', 'Creixell, Gustavo', "D'Arcy, Mark", 'Denis Lucey', 'Dexter Brown',
  'Kenneally, Niall', 'Lind, Matt', 'No Assigned L6', 'Punch, Patrick', 'Vega, Cyril',
  'Yap, Diane',
]

export const BUSINESS_PARTNERS = [
  'Bethany Rana', 'Juliano Alves Neres', 'Khim Sun Lau', 'Lucas Serafim', 'Marcy Jelinek',
  'Miguel Galicia', 'StephenRaj  Kumar',
]

export const CAPACITY_CODES = [
  'AM02','AM04','AM05','AM08','AN02','AN03','AO06','AO11','AO14','AP10','AP11','AP12',
  'AP13','AP14','AP15','AP16','AP17','AP18','AP19','AP20','AP21','AP22','AP23','AP24',
  'AP25','AP26','AX01','AZ09','AZ10','AZ11','AZ13','AZ16','BAH1','BL17','BPS1','BR02',
  'BT01','BT02','BT03','BT04','BT05','BT06','BT07','BT08','BT09','BT10','BT11','BT12',
  'BT13','BT14','BW01','BW02','BW03','BX02','BZ10','BZ11','BZ13','BZ14','BZ15','BZ19',
  'BZ20','BZ21','BZ22','BZ24','CC03','CC04','CC05','CC07','CC09','CC10','CC11','CC12',
  'CC13','CC14','CC22','CC23','CC27','CC28','CC29','CCB1','CCB2','CE01','CE02','CE03',
  'CG Comp','CG01','CGEQ','CGGC','CGVE','CGVX','CHEQ','CM01','CM03','CM04','CM05',
  'CSS1','CST4','CST5','CT11','CT12','CT13','CT14','CT15','CT16','CT17','CT18','CT19',
  'CT20','CT23','CT24','CT25','CT26','CT27','CT29','CT30','CT32','CT34','CT35','CT36',
  'CT37','CT38','CT67','CT68','CT69','CT70','CT76','CT91','CT95','CT96','CTA3','CTA4',
  'CTA5','CTA6','CTA7','CTE2','CTE3','CTE4','CTE6','CV01','CV02','CV03','CV04','CV05',
  'CX01','CX02','CX03','CX04','CX05','CZ03','DE07','DE08','DE09','DE10','DE12','DE13',
  'DE17','DE18','DP01','EC03','EC04','EC06','EC07','EC14','EC21','EC30','EC32','EC33',
  'EC34','EC39','EG13','EMC1','EN01','ER02','ES01','ES03','ES06','ES07','FD01','FED4',
  'FED6','FR05','FR06','FR07','FR08','FR09','FR11','FR12','FR13','FR23','FR27','GB01',
  'GB08','GB09','GB10','GB11','GB13','GB14','GB16','GB18','GB19','GB21','GB23','GB29',
  'GB31','GC02','GC04','GC06','GC11','GC12','GC13','GC14','GC16','GC17','GC18','GC19',
  'GC20','GC21','GC22','GC23','GC24','GC25','GCF1','GCTE','GG01','GH01','GH02','GH03',
  'GH04','GH05','GH06','GH07','GH08','GH09','GH10','GH11','GH12','GH13','GH14','GH15',
  'GH16','GH17','GH18','GH19','GH20','GH21','GH22','GH23','GH24','GH25','GM01','GP01',
  'GS01','GS02','GS03','GS04','GS05','GT06','HC06','HC07','HE01','HE02','HE03','HE04',
  'HE06','HE09','HE12','HE16','HE17','HE20','HE22','HE23','HE24','HE25','HE26','HE28',
  'HE29','HE30','HE32','HE36','HE37','HE38','HE39','HE40','HE41','HE42','HE43','HE44',
  'HE47','HE48','HE52','HE53','HE58','HE59','HE61','HE62','HE63','HE64','HE66','HE67',
  'HE68','HE70','HE71','HE72','HE73','HE74','HE78','HE81','HE85','HE93','HE95','HEA2',
  'HEA5','HEA9','HEB0','HEB4','HEB5','HEC5','HEC6','HEC7','HED1','HED2','HED3','HED7',
  'HEE4','HEE5','HEF2','HEF5','HEG3','HEG4','HEG8','HEH4','HEH5','HEH6','HEJ1','HEK8',
  'HEL1','HEL2','HEL3','HEL4','HEL5','HW03','HW06','HWPA','ID06','IM01','IN01','IN14',
  'IN15','IN16','IN19','INCV','INPX','INT1','IS01','IS02','IS03','IS04','IS05','IS11',
  'IS14','IS15','IS19','IS20','IS21','IS23','IS24','IS31','IS32','IS34','IS36','IS37',
  'IS38','IS41','IS42','IS47','IS48','IS50','IS51','IS58','IS59','IS61','IS63','IS64',
  'IS65','IS68','IS69','IS74','IS75','IS77','IS78','IS85','IS86','IS88','IS90','IS91',
  'IS92','IS96','IS98','IT04','IT08','IT10','IU02','IU05','IU06','IU13','IU14','IU16',
  'IU20','IU23','IU23a','IU24','IU29','IU30','IU32','IU33','IU40','IU41','IU43','IU45',
  'IU45a','IU46','IU56','IV01','IV03','JM01','JP11','JP13','JP19','JP22','JP24','JP25',
  'JP26','JP27','JP29','JV01','KR05','KR06','KR11','KR12','KR13','KR14','L2G4','L2G5',
  'LFT1','LOS0','LOS1','LOS2','LOS3','LOS4','LOS5','LS01','MR01','MR02','MR03','MY11',
  'MY13','MY14','MY15','NA01','NALC','NC04','NC14','ND02','ND03','NE02','NE04','NE05',
  'NE06','NE07','NE08','NE09','NE13','NE14','NE20','NE21','NE25','NE27','NE29','NE31',
  'NE33','NE35','NE36','NE38','NE39','NF01','NF02','NF03','NF04','NF05','NF06','NF09',
  'NF10','NF11','NF12','NF13','NF14','NF15','NF16','NF17','NF18','NF19','NF20','NF21',
  'NF22','NF23','NF24','NF25','NF26','NF27','NF28','NF29','NF30','NF31','NF32','NF33',
  'NF34','NF35','NF36','NF37','NF40','NF41','NF42','NF43','NF44','NF45','NF46','NF47',
  'NF48','NF49','NF50','NF53','NF54','NF56','NF57','NF58','PE01','PF01','PG01','PH08',
  'PHSS','PM01','PowerProtect','PP21','PS03','PS10','QCE1','RAH1','RE03','RL02','RL05',
  'RL09','RL10','RL11','RL12','RL14','RL15','RL16','RL18','RL19','RM02','ROEN','RP01',
  'RP02','RP03','RPS1','RR02','RR03','RTC1','SA10','SE02','SM02','SMP1','SMP2','SMP3',
  'SMP4','SMP5','SMP6','SMP7','SMP8','SP04','SP09','SP10','SS03','SW02','SY01','TH04',
  'TH07','THBW','UK03','UK05','UK06','UK07','UNOP','UPP1','VCF1','VCF2','VN02','VN03',
  'VN04','VX01','VX02','VX03','VX04','WM01','WM02','WM03','WM04','WM05','WP01','XE01',
  'XE02',
]

// ── Real queue name lists ─────────────────────────────────────────────────────

export const ACTIVE_QUEUE_NAMES = [
  'APJ DPD AVAMAR', 'APJ DPD AVAMAR Chinese', 'APJ DPD DataDomain', 'APJ DPD DataDomain Chinese',
  'APJ DPD Networker', 'APJ DPD Networker Chinese', 'APJ ESG Call Directors Chinese',
  'APJ HES Connectivity Chinese', 'APJ HES CST Chinese', 'APJ HES CST Japanese',
  'APJ HES CST Korean', 'APJ HES Integrated_Software Chinese', 'APJ HES MIDRANGE Chinese',
  'APJ HES MIDRANGE Japanese', 'APJ HES Symmetrix Chinese', 'APJ HES Symmetrix Japanese',
  'APJ HES Symmetrix Korean', 'APJ HES SymmSW Chinese', 'APJ HES Vplex Chinese',
  'APJ HES XtremIO', 'APJ Manager', 'APJ Non-Frontline', 'APJ Quality Coach',
  'APJ UDS PowerScale Chinese', 'APJ UDS PowerScale Japanese', 'ARS ESC Commercial REC',
  'CCC CNS Cantonese BW', 'CCC CNS Mandarin BW', 'CCC Compute Basic Mandarin Voice BW',
  'CCC Compute Mandarin Email BW', 'CCC Compute ProSupport Mandarin Voice BW',
  'CCC Enterprise CMG Mandarin Voice BW', 'CCC MidRange Mandarin', 'CCC Midrange Mandarin BW',
  'CER Server German', 'CNS Manager', 'CST VIC', 'CZE Enterprise (BRA)',
  'DPD/UDS Manager', 'DPD/UDS Non-Frontline', 'DPD/UDS Quality Coach', 'DPD/UDS Technical Lead',
  'E2E Manager', 'E2E Quality Coach', 'EC Compute CEE RUA', 'EC GRE ProSupp Server (MTP)',
  'EC POL Enterprise (HAL)', 'EC ProSupp Server Hebrew (CGS)', 'EC ProSupp Server Turkish (HAL)',
  'EC Server Arabic', 'EC Server Basic Hebrew (CGS) NET', 'EMEA DPD AVAMAR',
  'EMEA DPD DataDomain', 'EMEA DPD Networker', 'EMEA Manager', 'EMEA Quality Coach',
  'EMEA Solutions HCI FL', 'EMEA Solutions MS FL', 'EMEA UDS PowerScale',
  'ENG ProSupp Dutch Server (CWD)', 'ENG ProSupp Nordics Server (CWD)',
  'Enterprise Pro/Core ID', 'Enterprise Pro/Core TH', 'Enterprise Pro/Core VN',
  'FRA Networking (MTP)', 'France Storage', 'GER Networking (HAL)', 'German Storage',
  'German Trainees', 'GIST Manager', 'GIST Quality Coach', 'Global Compute Community Forum',
  'Global Compute English', 'Global Compute Hardware', 'Global Connectivity Backline',
  'Global Connectivity FL', 'Global DLM Backline', 'GLOBAL DPD AVAMAR',
  'GLOBAL DPD DataDomain', 'GLOBAL DPD DPA', 'GLOBAL DPD DPSolutions',
  'GLOBAL DPD Networker', 'GLOBAL DPD PowerProtect', 'Global DPD PowerProtect Cyber',
  'GLOBAL DPD RecoverPoint', 'GLOBAL E2E Connectivity', 'Global ESG Midrange Backline',
  'Global HCS Content Creators', 'GLOBAL HES BSAFE', 'GLOBAL HES Integrated_Software',
  'GLOBAL HES MIDRANGE Backline', 'Global HES Midrange FL', 'GLOBAL HES Wipro',
  'Global Inbound Support Team', 'Global Integrated Software FL', 'Global Mainframe Backline',
  'Global Midrange', 'Global Networking', 'Global Networking English', 'Global PowerEdge DSE',
  'Global PowerEdge XE DE', 'Global PowerEdge XE Multi-Lingual', 'Global PowerFlex',
  'Global PowerFlex Domain Engineer', 'Global Powerstore', 'Global Solutions HCI DE',
  'Global Solutions MS DE', 'Global Symmetrix Backline', 'Global Symmetrix FL',
  'Global Symmetrix SW FL', 'Global SymmSW Backline', 'Global TELCO', 'GLOBAL UDS OBJ',
  'GLOBAL UDS PowerScale', 'Global Vplex Backline', 'Global Vplex FL', 'Global VxRail',
  'Global VxRail Domain Engineer', 'HCS APJ VxRail Chinese', 'HCS APJ VxRail Japanese',
  'HCS APJ VxRail Korean', 'HCS Global DSE', 'HCS LATAM BRZ VxRail', 'HCS LATAM MMCLA VxRail',
  'HCS Manager', 'HCS Non-Frontline', 'HCS Quality Coach', 'HCS Technical Lead',
  'HES Manager', 'HES Quality Coach', 'HES Technical Lead', 'KOR Storage Upsell Korean',
  'Korea CNS', 'LATAM AH Portuguese', 'LATAM AH Spanish', 'LATAM Avamar Portuguese',
  'LATAM Avamar Spanish', 'LATAM Compute Portuguese', 'LATAM Compute Spanish',
  'LATAM DataDomain Portuguese', 'LATAM DataDomain Spanish', 'LATAM ECS Portuguese',
  'LATAM ECS Spanish', 'LATAM Manager', 'LATAM Midrange Portuguese', 'LATAM Midrange Spanish',
  'LATAM Networker Portuguese', 'LATAM Networker Spanish', 'LATAM Networking Portuguese',
  'LATAM Networking Spanish', 'LATAM Non-Frontline', 'LATAM PowerScale Portuguese',
  'LATAM PowerScale Spanish', 'LATAM Primary Storage Portuguese', 'LATAM Primary Storage Spanish',
  'LATAM Quality Coach', 'LATAM Top Customers Portuguese', 'LATAM Top Customers Spanish',
  'Licensing Manager', 'Licensing Quality Coach', 'Licensing Support', 'MOONEY ELT',
  'NA Basic Core Concentrix', 'NA Server Basic (Concentrix)', 'NA Server Basic Chat (CNX)',
  'NAMER DPD AVAMAR', 'NAMER DPD DataDomain', 'NAMER DPD Networker', 'NAMER Quality Coach',
  'NAMER UDS PowerScale', 'Networking IND', 'Networking Pro/Core Japan',
  'Nordics Server Core (TUR)', 'PS One', 'PS One Field Consultant', 'ROE Networking (MULTI)',
  'RPS Manager', 'RPS Proactive Systems Maintenance', 'RPS Remote Proactive Services',
  'S&AS Manager', 'SER Compute Iberian', 'SER Server French', 'SER Server Italian',
  'Server Core ANZ CNX', 'Server Core IND CNX', 'Server Core SA CNX', 'Server Pro/Core Japan',
  'Server ProSupport IND', 'Server ProSupport Plus Japan', 'Service Engineering Non-Frontline',
  'Social Media Quality Coach', 'SSO Manager', 'SSO Non-Frontline', 'SSO NR-FLS',
  'Storage IND', 'Storage Pro/Core Japan', 'UKISA Basic Enterprise (Concentrix)',
  'VCF Delivery Engineer', 'VCF Upgrade Coordinator',
]

export const INACTIVE_QUEUE_NAMES = [
  'AMER English Avamar', 'AMER English Connectivity', 'AMER English DataDomain',
  'AMER English Integrated Software', 'AMER English Networker', 'AMER English OBJ',
  'AMER English PowerScale', 'AMER English VMAX', 'AMER English Vplex', 'AMER English XtremIO',
  'ANZ Midrange Storage VNX/e', 'ANZ VX Rail Storage', 'APJ Biz Ops', 'APJ DPD DP Solutions',
  'APJ DPD DPSolutions', 'APJ DPD DPSolutions Chinese', 'APJ English CTE', 'APJ English Midrange',
  'APJ English PowerScale', 'APJ English VXRail', 'APJ GNCS Hyperconverged Wipro',
  'APJ HES Connectivity', 'APJ HES Integrated_Software', 'APJ HES MIDRANGE', 'APJ HES Symmetrix',
  'APJ HES SymmSW', 'APJ HES Vplex', 'APJ NR-FLS', 'APJ Support Resolution Team',
  'APJ UDS OBJ', 'APJ UDS PowerScale', 'APJ Upsell-Operations Multi', 'APJ WFM',
  'ARS System Exchange', 'AST Quality Coach', 'Backup Solution HC US', 'BLR Ent Basic (Alternate)',
  'Brazil ESG CTE', 'Brazil Midrange', 'Brazil Powerstore', 'Brazil Senior and Master Engineer',
  'BRZ HC Server Voice (EL)', 'BRZ HC Storage Voice (EL)', 'BRZ LC Server Voice (EL)',
  'BRZ LC Storage Voice (EL)', 'CCC CNS Cantonese', 'CCC CNS Mandarin', 'CCC CNS Mandarin Email',
  'CCC CNS Mandarin Voice', 'CCC HES VXRail Hyperconverged', 'CCC Midrange Storage VNX/e',
  'CCC VX Rail Storage', 'CCC Workstation BW', 'CHK Cons Tech CSQ BW', 'Client Pro/Core VN',
  'Client ProSupport ANZ', 'Client ProSupport CCC BW', 'Client ProSupport CCC ML',
  'Client Prosupport TH (CTX)', 'Client ProSupport US', 'Client Prosupport VN (CTX)',
  'Compellent Copilot US', 'Compute High Complexity', 'Compute ProSupport Alt Channel',
  'CPS Chat ROLA', 'CST SPUS', 'CTE ANZ', 'CTE BRZ', 'CTE CCC', 'CTE Enterprise KOR',
  'CTE Global English', 'CTE IND', 'CTE JPN', 'CTE KOR', 'CTE NW IND', 'CTE ROLA', 'CTE SA',
  'CTE Server/Networking CCC', 'CTE Server/Networking JPN', 'CTE Storage CCC', 'CTE Storage IND',
  'CTE Storage JPN', 'DPD/UDS NR-FLS', 'DSP OEM', 'EC Basic Enterprise (CAS)',
  'EC ProSupp Server Arabic (CAS)', 'EC ProSupp Server CEE (HAL)', 'EC ProSupp Storage',
  'EC RUS Enterprise (HAL)', 'EMEA Biz Ops', 'EMEA English Avamar', 'EMEA English Connectivity',
  'EMEA English DataDomain', 'EMEA English Integrated Software', 'EMEA English Networker',
  'EMEA English OBJ', 'EMEA English PowerScale', 'EMEA English VMAX', 'EMEA English Vplex',
  'EMEA English XtremIO', 'EMEA HES Connectivity', 'EMEA HES Integrated_Software',
  'EMEA HES MIDRANGE', 'EMEA HES Symmetrix', 'EMEA HES SymmSW', 'EMEA HES Vplex',
  'EMEA HES XtremIO', 'EMEA MODULAR CTE', 'EMEA Non-Frontline', 'EMEA NR-FLS',
  'EMEA PowerScale CTE', 'EMEA ProSupp SST', 'EMEA ProSupport Compellent',
  'EMEA ProSupport Powerstore', 'EMEA ProSupport Powervault', 'EMEA Quality Coach Compute',
  'EMEA SERVER CTE', 'EMEA Server Upsell English', 'EMEA SME Team', 'EMEA Solutions HCI (ENG)',
  'EMEA Solutions HCI (FRA)', 'EMEA Solutions HCI (GER)', 'EMEA Solutions MS (ENG)',
  'EMEA Solutions MS (FRA)', 'EMEA Solutions MS (GER)', 'EMEA Static Central',
  'EMEA Static Revenue', 'EMEA Storage CTE', 'EMEA Support Resolution Team',
  'EMEA Technical Support Operations', 'EMEA UDS OBJ', 'EMEA VX Rail Storage', 'EMEA WFM',
  'ENG Modular (CWD)', 'ENG ProSupp Server', 'ENG ProSupp Server 247 (CWD)',
  'ENG ProSupport Plus Server', 'ENG Solutions (CWD)', 'Enterprise Alt-channel JPN',
  'Enterprise ANZ AOH', 'Enterprise Core CCC', 'Enterprise Core/ProSupport MIY',
  'Enterprise Echannel CCC', 'Enterprise Echannel Core/Pro MIY', 'Enterprise Pro/Core PH',
  'Enterprise ProSupport ANZ/SA', 'Enterprise ProSupport KOR', 'Enterprise SA',
  'Enterprise SA Email', 'Enterprise Support Services US', 'Enterprise Triage Queue US',
  'Enterprise TW', 'Federal Server US', 'Federal Support NA', 'FRA Basic Enterprise (CAS)',
  'FRA Modular (MTP)', 'FRA ProSupp Server Alternate', 'FRA ProSupp Storage (MTP)',
  'FRA ProSupport Plus Server (MTP)', 'FRA ProSupport Server (CAS)', 'FRA Solutions (MTP)',
  'French Midrange', 'French VXRail', 'GER Enterprise (HAL)', 'GER Modular (HAL)',
  'GER ProSupp OWR Ent (HAL)', 'GER ProSupp Server Email (HAL)', 'GER ProSupp Storage Co Pilot',
  'GER Solutions (HAL)', 'German Midrange', 'German VXRail', 'Global AST',
  'GLOBAL Compellent Capgemini', 'Global Compute Software', 'GLOBAL DPD Cloudboost',
  'GLOBAL DPD DPADSRT', 'GLOBAL DPD SOURCEONE', 'GLOBAL Equallogic Capgemini',
  'GLOBAL HES MIDRANGE', 'GLOBAL HES XtremIO', 'Global Networking RTSE',
  'Global Service Routing Manager', 'Global TELCO - Server', 'Global TELCO Networking',
  'GLOBAL VNX Capgemini', 'GLOBAL VNXe Capgemini', 'Global VxRail CTE',
  'HCS AMER Converged Infrastructure', 'HCS APJ Converged Infrastructure', 'HCS APJ VxRail',
  'HCS APJ VxRail English NAMER AOH', 'HCS EMEA Converged Infrastructure', 'HCS EMEA VxRail',
  'HCS Global APEX', 'HCS Global Cloud Solutions', 'HCS Global Converged',
  'HCS Global Converged Infrastructure', 'HCS Global PowerFlex', 'HCS Global Solutions',
  'HCS Global Vmware', 'HCS Global VxRail', 'HCS INDIA VxRail', 'HCS LATAM VxRail',
  'HCS NAMER VxRail', 'HCS NR-FLS', 'HES Global AVAMAR', 'HES Global Cloudboost',
  'HES Global Connectivity', 'HES Global CST Chat', 'HES Global CST Management',
  'HES Global CST VIC', 'HES Global DataDomain', 'HES Global DLM', 'HES Global DPA',
  'HES Global DPADSRT', 'HES Global DPSolutions', 'HES Global DPSolutions WIPRO',
  'HES Global DSE', 'HES Global E2E CONNECTIVITY', 'HES Global Hyperconverged',
  'HES Global Mainframe', 'HES Global Networker', 'HES Global OBJ', 'HES Global Operations',
  'HES Global PowerScale', 'HES Global PowerScale Support', 'HES Global RCM',
  'HES Global RecoverPoint', 'HES Global RecoverPoint WIPRO', 'HES Global Remote Proactive',
  'HES Global Solutions', 'HES Global SOURCEONE', 'HES Global SSG', 'HES Global SymmSW',
  'HES Global VMAX', 'HES Global Vplex', 'HES Global XtremIO', 'HES Non-Frontline', 'HES NR-FLS',
  'Honeywell Panama', 'IND Midrange Storage VNX/e', 'IND VX Rail Storage', 'India Core Concentrix',
  'India DPD AVAMAR', 'India DPD DataDomain', 'India DPD Networker', 'India HES Connectivity',
  'India HES Integrated_Software', 'INDIA HES MIDRANGE', 'India HES SymmSW', 'India HES Vplex',
  'India HES XtremIO', 'India Premium Support', 'India UDS OBJ', 'India UDS PowerScale',
  'ISR Client (Netanya)', 'ITA Basic Enterprise (CAS)', 'ITA ProSupp Server (MTP)',
  'ITA Social Media (MTP)', 'Italian Midrange', 'Japan Enterprise SW-NWK',
  'Japan Storage ProSupport KAW', 'JP Midrange Storage VNX/e', 'JP VX Rail Storage',
  'KOR Compute Basic Korean', 'KOR Compute Upsell Korean', 'KOR Networking Upsell Korean',
  'LATAM DPD AVAMAR', 'LATAM DPD DataDomain', 'LATAM DPD DPA', 'LATAM DPD Networker',
  'LATAM HES MIDRANGE', 'LATAM HES Symmetrix', 'LATAM HES SymmSW', 'LATAM NR-FLS',
  'LATAM UDS OBJ', 'LATAM UDS PowerScale', 'LATAM WFM', 'Midrange Storage VNX/e',
  'MMCLA ESG CTE', 'MMCLA HC Server Voice (PAN)', 'MMCLA LC Server Voice (PAN)',
  'MMCLA Midrange', 'MMCLA Midrange Storage VNX/e', 'MMCLA Midrange Storage VNX/e Spanish',
  'MMCLA Powerstore', 'MMCLA VXRail Spanish', 'Modular US', 'NA Compute Pro Support',
  'NA CTE Server', 'NA CTE Storage', 'NA Midrange Storage VNX/e', 'NA OOP Resolver',
  'NA PowerScale HE Storage Voice', 'NA Premium Support', 'NA ProSupp Storage eSupport',
  'NA Server Basic (BNG)', 'NA Server Basic Chat (BNG)', 'NA VX Rail Storage',
  'NAMER HES Connectivity', 'NAMER HES Integrated_Software', 'NAMER HES MIDRANGE',
  'NAMER HES Symmetrix', 'NAMER HES SymmSW', 'NAMER HES Vplex', 'NAMER HES XtremIO',
  'NAMER Manager', 'NAMER NR-FLS', 'NAMER Technical Lead', 'NAMER UDS OBJ', 'NAMER WFM',
  'NCS Non-Frontline', 'Networking Basic US', 'Networking CCC', 'Networking Pro Core SA',
  'Networking Product Escalations', 'Networking ProSupport Analysts US',
  'Networking ProSupport ANZ', 'Networking ProSupport RTSE US', 'Networking ProSupport US',
  'Networking SPSPE', 'Partner Management', 'POR Midrange Storage VNX/e',
  'POR ProSupp Server (MTP)', 'PowerEdge After Hours US', 'PowerEdge Alternate Channel US',
  'Powerstore US', 'Proactive Systems Maintenance BR', 'Proactive Systems Maintenance CCC',
  'Proactive Systems Maintenance EMEA', 'Proactive Systems Maintenance NA',
  'Proactive Systems Maintenance ROLA', 'Proactive Systems Maintenance SA',
  'ProSupp EQL (CWD)', 'ProSupp EQL (MTP)', 'ProSupp Storage 247 (CWD)',
  'ProSupp Storage Co Pilot (CWD)', 'Quality Lead US', 'RM Brazil', 'RM Manager',
  'RM NA Enterprise', 'RM NR-FLS', 'RM ROLA', 'ROLA Senior and Master Engineer',
  'RPS Non-Frontline', 'RPS WFM', 'RT Linux / Virtualization US', 'RT Microsoft US',
  'Server Combined CCC', 'Server Core IND', 'Server eSupport Case Director US',
  'Server ProSupport ANZ', 'Server ProSupport CCC', 'Server ProSupport Chat US',
  'Server ProSupport Plus CCC', 'Server ProSupport ROLA', 'Server SPSPE',
  'Service Engineering Manager', 'Service Engineering Technical Lead', 'Service Engineering WFM',
  'Skytech Enterprise SA', 'SMPE English LVTS', 'SMPE English Microsoft',
  'SMPE English Networking', 'SMPE English Nutanix', 'SMPE English Server',
  'SMPE English Storage MD', 'SMPE English Storage PS', 'SMPE English Storage SC',
  'Social Media CCC', 'Social Media EMEA', 'Social Media English', 'Social Media English (AMER)',
  'Social Media English (APJ)', 'Social Media Non-Frontline', 'Solutions SPSPE',
  'SPA Basic Enterprise (CAS)', 'SPA ProSupp Server (MTP)', 'SPA Social Media (MTP)',
  'Spanish Midrange', 'Spanish VXRail', 'SSO Quality Coach', 'SSO Quality Lets Fix It',
  'SSO WFM', 'Storage Echannel CCC', 'Storage ProSupport ANZ', 'Storage ProSupport CCC',
  'Storage ProSupport SA', 'Storage PS MD US', 'Storage ROLA', 'STRATEGY Non-Frontline',
  'Support Ops ROLA', 'SWE Client ProSupp (TUR)', 'Triage Enterprise Support Panama',
  'UKI Midrange', 'UKI Networking (CWD)', 'UKI Storage', 'UKI VXRail',
  'UKISA Basic Enterprise (BGL)', 'UKISA Client DSP (BGL)', 'US Federal Support Storage',
  'VXRail', 'Wipro AMER Midrange', 'Workflow Management', 'Workstation IND', 'Wyse IND',
]

function inferRegion(name) {
  if (/^APJ|^HCS APJ|^HCS LATAM|^Korea|^KOR|^ANZ|^MMCLA|^CCC|^Japan|^JP |^BRZ|^Brazil|CTE.*JPN|CTE.*KOR|CTE.*CCC/.test(name)) return 'APJ'
  if (/^LATAM|^ROLA|Portuguese$|Spanish$|Panama/.test(name)) return 'LATAM'
  if (/^EMEA|^ENG |^GER |^German|^FRA |^French|^ITA |^Italian|^SPA |^EC |^CER|^CZE|^ROE|^SWE|Nordics|^UKI|^UKI/.test(name)) return 'EMEA'
  if (/^AMER|^NA |^NAMER|^US |Federal|Modular US|Enterprise.*US|Powerstore US/.test(name)) return 'AMER'
  return 'Global'
}

// ── Cards ────────────────────────────────────────────────────────────────────
export const CARD_DATA = {
  totalQueues:     { active: 199, inactive: 406 },
  callVolume:      { offered: 285400, handled: 268700, handlePct: 94.1 },
  dbOspSplit:      { db: 68, osp: 32, dbVol: 193872, ospVol: 91128 },
  forecastAccuracy:{ value: 87.4, target: 90 },
  cqnVariance:     { withinRange: 147, total: 199, pct: 73.8 },
}

export const ACTIVE_QUEUES = ACTIVE_QUEUE_NAMES.map((name, i) => ({
  name,
  region: inferRegion(name),
  offered: 20000 + i * 320,
  handled: 18800 + i * 300,
  accuracy: 75 + (i * 7) % 25,
}))

// ── Plan over Plan (Layer 1) ─────────────────────────────────────────────────
const BASE_PLAN = { FY25: 240000, FY26: 268000, FY27: 295000 }

export const PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan1: BASE_PLAN[fy],
  plan2: Math.round(BASE_PLAN[fy] * (0.93 + Math.random() * 0.1)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_QTR = ['Q1 FY26','Q2 FY26','Q3 FY26','Q4 FY26'].map((q, i) => ({
  period: q,
  plan1: 58000 + i * 4000,
  plan2: 55000 + i * 4200,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_WEEK = FISCAL_WEEKS.map((w, i) => ({
  period: w,
  plan1: 4200 + (i % 4) * 200,
  plan2: 4000 + (i % 4) * 210,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

// Order matches REGIONS: APJ, EMEA, Global, LATAM, NAMER
export const PLAN_VS_PLAN_BY_REGION = REGIONS.map((r, i) => ({
  region: r,
  plan1: [62000, 78000, 50000, 33000, 95000][i],
  plan2: [58000, 81000, 48000, 31000, 89000][i],
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

const VARIANCE_SAMPLE = [
  'EMEA DPD AVAMAR',
  'APJ HES XtremIO',
  'NAMER DPD DataDomain',
  'Global Powerstore',
  'LATAM Manager',
]

export const PLAN_VS_PLAN_BY_CQN = VARIANCE_SAMPLE.map((cqn, i) => ({
  cqn,
  plan1: 22000 + i * 2800,
  plan2: 20500 + i * 3000,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

// ── Actual vs Plan (Layer 2) ─────────────────────────────────────────────────
export const ACTUAL_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  actual: BASE_PLAN[fy] * (0.88 + Math.random() * 0.08),
  plan:   BASE_PLAN[fy],
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
})).map(d => ({ ...d, actual: Math.round(d.actual) }))

export const ACTUAL_VS_PLAN_BY_QTR = ['Q1 FY26','Q2 FY26','Q3 FY26','Q4 FY26'].map((q, i) => ({
  period: q,
  actual: Math.round((56000 + i * 3800) * (0.87 + (i % 3) * 0.04)),
  plan:   58000 + i * 4000,
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export const ACTUAL_VS_PLAN_BY_WEEK = FISCAL_WEEKS.map((w, i) => ({
  period: w,
  actual: Math.round((4200 + (i % 4) * 200) * (0.85 + (i % 5) * 0.03)),
  plan:   4200 + (i % 4) * 200,
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

// Stacked bar: adherence buckets per FY
export const STACKED_ADHERENCE = [
  { fy: 'FY25', excellent: 43, good: 36, fair: 9,  poor: 13 },
  { fy: 'FY26', excellent: 25, good: 40, fair: 17, poor: 19 },
  { fy: 'FY27', excellent: 31, good: 29, fair: 25, poor: 15 },
]

export const ACTUAL_VS_PLAN_BY_CQN = VARIANCE_SAMPLE.map((cqn, i) => {
  const plan = 22000 + i * 2800
  const actual = Math.round(plan * (0.78 + i * 0.03))
  return {
    cqn,
    actual, plan,
    variance: +((actual - plan) / plan * 100).toFixed(1),
  }
})

// ── Geo Map (Layer 3) ────────────────────────────────────────────────────────
export const GEO_REGION_DATA = [
  { region: 'AMER',  accuracy: 91, lat: 0,    lng: -95,  label: 'AMER' },
  { region: 'EMEA',  accuracy: 79, lat: 50,   lng: 10,   label: 'EMEA' },
  { region: 'APJ',   accuracy: 85, lat: 25,   lng: 100,  label: 'APJ' },
  { region: 'LATAM', accuracy: 68, lat: -15,  lng: -60,  label: 'LATAM' },
]

export const GEO_COUNTRY_DATA = [
  { country: 'USA',         region: 'AMER',  accuracy: 93, lat: 38,   lng: -97 },
  { country: 'Canada',      region: 'AMER',  accuracy: 88, lat: 57,   lng: -100 },
  { country: 'Mexico',      region: 'AMER',  accuracy: 82, lat: 24,   lng: -102 },
  { country: 'Brazil',      region: 'LATAM', accuracy: 71, lat: -10,  lng: -55 },
  { country: 'UK',          region: 'EMEA',  accuracy: 85, lat: 53,   lng: -2 },
  { country: 'Germany',     region: 'EMEA',  accuracy: 78, lat: 51,   lng: 10 },
  { country: 'France',      region: 'EMEA',  accuracy: 80, lat: 46,   lng: 2 },
  { country: 'India',       region: 'EMEA',  accuracy: 75, lat: 22,   lng: 80 },
  { country: 'Japan',       region: 'APJ',   accuracy: 90, lat: 36,   lng: 138 },
  { country: 'Australia',   region: 'APJ',   accuracy: 87, lat: -27,  lng: 133 },
  { country: 'Singapore',   region: 'APJ',   accuracy: 83, lat: 1.3,  lng: 103.8 },
  { country: 'China',       region: 'APJ',   accuracy: 79, lat: 35,   lng: 105 },
  { country: 'Argentina',   region: 'LATAM', accuracy: 65, lat: -34,  lng: -64 },
  { country: 'Colombia',    region: 'LATAM', accuracy: 70, lat: 4,    lng: -72 },
]
