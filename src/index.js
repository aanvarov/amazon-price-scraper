const axios = require('axios');
const { JSDOM } = require('jsdom');

const getProductUrl = (product_id) =>
  `https://www.amazon.com/gp/aod/ajax/?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-1&pc=dp`;

const getPrices = async (product_id) => {
  const productUrl = getProductUrl(product_id);
  console.log(productUrl);
  const { data: html } = await axios.get(productUrl, {
    headers: {
      accept: 'text/html,*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en,en-US;q=0.9,ru-RU;q=0.8,ru;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      cookie:
        'session-id=146-3850055-9313448; session-id-time=2082787201l; i18n-prefs=USD; lc-main=en_US; sp-cdn="L5Z9:UZ"; ubid-main=133-3125044-7282226; aws_lang=en; aws-target-visitor-id=1635848041420-314486.34_0; AMCVS_7742037254C95E840A4C98A6@AdobeOrg=1; s_cc=true; aws-mkto-trk=id:112-TZM-766&token:_mch-aws.amazon.com-1635848042743-53667; aws-ubid-main=352-1821706-5785163; awsc-color-theme=light; s_campaign=em|GLOBAL_NCA_AB_global-signup-abandoners_20210319_03Resources_EMAIL03|aws|em_354151|acq|GlobalLP1_EmailC_CTA2|abdn|accountsignup|acq=em_354151|UZ; aws-reg-aid=d813ac5015d6993eb5fa7054a83c570f3ddfd0efe02291d8ab11656771035ab1; aws-reg-guid=d813ac5015d6993eb5fa7054a83c570f3ddfd0efe02291d8ab11656771035ab1; regStatus=registered; aws-session-id=861-8402854-4008263; aws-analysis-id=861-8402854-4008263; aws-session-id-time=1636118005l; s_sq=[[B]]; aws-target-data={"support":"1"}; AMCV_7742037254C95E840A4C98A6@AdobeOrg=1585540135|MCIDTS|18945|MCMID|15359284227487031078178806959305185146|MCAID|NONE|MCOPTOUT-1636790958s|NONE|vVersion|4.4.0; aws-userInfo-signed=eyJ0eXAiOiJKV1MiLCJrZXlSZWdpb24iOiJ1cy1lYXN0LTEiLCJhbGciOiJFUzM4NCIsImtpZCI6ImQ4NWNkZjU1LTcxNDEtNDE0NS04YTY3LTZjYTQyZTNiZTJjYyJ9.eyJzdWIiOiIiLCJzaWduaW5UeXBlIjoiUFVCTElDIiwiaXNzIjoiaHR0cDpcL1wvc2lnbmluLmF3cy5hbWF6b24uY29tXC9zaWduaW4iLCJrZXliYXNlIjoiZTNkUWxMajE5NjQ3Q2c0WDRJSnJrVTZSU2hFaGJiQkhSdHB6UnZ1RHI2Yz0iLCJhcm4iOiJhcm46YXdzOmlhbTo6NDk5NzAwMTk2MDI2OnJvb3QiLCJ1c2VybmFtZSI6ImFhbnZhcm92In0.pIm7IC86TdP15t9UkVqo4T7HXMRR1MQny0H3CRMi2_FtN1_2mWWfj7_DeL0N1UIBao3Ea0GJ8me9tQxqlmHCX3s3p22860kWBUHO00qG2N9GyibCTo3ew_7-7TOAOSDv; aws-userInfo={"arn":"arn:aws:iam::499700196026:root","alias":"","username":"aanvarov","keybase":"e3dQlLj19647Cg4X4IJrkU6RShEhbbBHRtpzRvuDr6c\u003d","issuer":"http://signin.aws.amazon.com/signin","signinType":"PUBLIC"}; session-token=RrCUNKc1YKFGlsDbOwg+GQgvPgZ/H7axCpU0PuPtbWNB1DDRj0kMCGx0W8fgvvG+/nV4VmFgzXP4cvkSfgx9GukBivRDf5FfA1FQzkU0gvSqdJER0uYe6acqnxGEp9LIqaIGk5a8InDmaHHY10olPq2AvePrIAaBpN77QrpCdDbojpzyrstF23AwNP70TKm+; skin=noskin; csm-hit=tb:s-N1A8SC04XC4WRWG0J4SS|1637697396875&t:1637697398155&adb:adblk_no',
      // not needed user-agent:
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
    },
  });
  const dom = new JSDOM(html);
  const $ = (selector) => dom.window.document.querySelector(selector);
  const title = $('#aod-asin-title-text').textContent.trim();
  const pinnedElement = $('#aod-offer');
  const pinnedPrice = pinnedElement.querySelector(
    '.a-price .a-offscreen'
  ).textContent;

  const pinnedOfferIdJSON = pinnedElement
    .querySelector('span[data-action="aod-atc-action"]')
    .getAttribute('data-aod-atc-action');

  const pinnedOfferId = JSON.parse(pinnedOfferIdJSON).oid;
  const pinnedShippedFrom = pinnedElement
    .querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small')
    .textContent.trim();
  const pinnedSoldBy = pinnedElement
    .querySelector('#aod-offer-soldBy .a-col-right .a-size-small')
    .textContent.trim();

  const pinned = {
    price: pinnedPrice,
    offer_id: pinnedOfferId,
    ships_from: pinnedShippedFrom,
    sold_by: pinnedSoldBy,
  };

  const offerListElement = $('#aod-offer-list');
  const offerList = offerListElement.querySelectorAll('.aod-information-block');

  const offers = [];
  offerList.forEach((offer) => {
    offers.push({
      price: offer.querySelector('.a-price .a-offscreen').textContent,
    });
    const offerPrice = offer.querySelector('.a-price .a-offscreen').textContent;
    const offerIdJSON = offer
      .querySelector('span[data-action="aod-atc-action"]')
      .getAttribute('data-aod-atc-action');
  });
  console.log(offers);

  const result = {
    title,
    pinned,
    offers: [],
  };
  console.log(result);
};

getPrices('B00N1YPXW2');
