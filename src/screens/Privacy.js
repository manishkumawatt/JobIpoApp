/* eslint-disable prettier/prettier */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView
} from 'react-native';
import React from 'react';
import Menu from '../components/Menu';
import { Header2 as Header } from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Privacy = ({ navigation }) => {
  const products = [
    {
      id: 0,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 1,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 2,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 3,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 4,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 5,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },

  ];
  return (
    <>
      {/* <Header title= 'Privacy Policy' /> */}
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.paragraph}>
              {`
              Privacy Policy for Jobipo

Effective Date: 14/04/2025

Jobipo is a commercial app by Adshrtech Media Private Limited (“Jobipo”). This page informs visitors about our policies regarding the collection, use, and disclosure of personal information for anyone using the Jobipo app and website (“Jobipo Platform”). By accessing or using the Jobipo Platform, you agree to the terms of this Privacy Policy and our Terms of Service.

We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.

1. Information We Collect

We collect information to provide better services to our users and to ensure a safe and functional job platform.

a. Personal Identification Information
	•	Your full name, email address, mobile number, and date of birth help us create and verify your account.
	•	Gender is collected to personalize job listings or for employer requirements where applicable.
	•	Profile photo may be used to create a professional identity on your profile.
	•	We also collect your PAN card details to comply with income tax regulations in India, and your bank account details for processing affiliate payouts securely.

b. Professional and Job-Related Information
	•	We collect your resume/CV, education background, work experience, skills, job preferences, and languages known so that we can match you with suitable job opportunities.
	•	This information may be shared with potential employers and recruiters who use Jobipo for hiring.

c. Usage and Technical Information
	•	We automatically collect data such as your IP address, browser type, device information, operating system, and location data (if permission is granted) to optimize your experience on the platform.
	•	We also gather usage behavior, such as pages visited, time spent on each page, buttons clicked, etc., to improve app and website performance.

d. Contacts Access (Optional)
	•	If you choose to grant us permission, we may access your phone contacts to assist with referrals, affiliate marketing, or networking within the platform. This is completely optional and requires your explicit consent.


2. How We Use Your Information

Your information is collected and used for multiple purposes, including but not limited to:
	•	To create, manage, and secure your Jobipo account
	•	To recommend jobs that match your profile and connect you with verified employers
	•	To process affiliate payouts, manage TDS deductions, and send relevant financial notifications
	•	To send alerts, notifications, emails, or SMS regarding new job openings or important updates
	•	To improve platform functionality, customize content, and enhance user experience
	•	To ensure platform security, detect suspicious activity, and prevent fraud
	•	To comply with legal obligations and regulatory requirements

We strive to use your data only in ways that serve your interest and provide value through the Jobipo Platform.


3. Sharing of Information

We do not sell your personal data to third parties. However, your information may be shared with:
	•	Verified employers and recruiters looking to hire candidates matching your profile
	•	Financial institutions and payment gateways for processing affiliate earnings and verifying bank account details
	•	Tax authorities, in case of legal obligation to report income and TDS deductions
	•	Third-party service providers, such as cloud storage providers, communication tools, or analytics services that help us run the platform efficiently
	•	Law enforcement agencies, if required by court order or applicable law

Every third-party partner is required to maintain strict confidentiality and follow data protection practices.


4. Data Retention

We retain your data:
	•	For as long as your account remains active
	•	As necessary to comply with legal, tax, and regulatory requirements
	•	To resolve disputes and enforce our agreements

If you wish to delete your account or personal information, you can do so by emailing us at support@jobipo.com. However, some information may be retained for legal and business purposes.


5. Your Rights

You have control over your data. You can:
	•	Access and update your profile information through the app or website
	•	Request deletion of your account and associated personal data
	•	Withdraw consent for permissions such as location or contacts access
	•	Request information on your affiliate payments or TDS deductions

We will respond to all such requests in accordance with applicable law and within a reasonable timeframe.


6. Trust & Safety

We work hard to create a safe and respectful job-seeking environment. Our team continuously monitors the platform to detect suspicious behavior or policy violations.

However, Jobipo cannot fully guarantee the authenticity of all users. We recommend:
	•	Verifying the identity and background of any employer or candidate before proceeding
	•	Avoiding payments or sharing sensitive information without due diligence
	•	Reporting any suspicious or abusive behavior to us via support@jobipo.com

We are committed to acting swiftly in response to such reports to maintain a secure platform.


7. Cookies

We use cookies and similar technologies to:
	•	Remember your login session
	•	Personalize job recommendations
	•	Analyze user behavior to improve our services
	•	Enable certain features like chat, alerts, and language preferences

You can manage cookie settings through your browser. Disabling cookies may affect the functionality of the platform.


8. Disclaimer

Jobipo does not hold any responsibility for any incident, fraud, cheat, or crime that may happen to any users. We advise all users to independently verify the authenticity of job opportunities, employers, and candidates. Please use your best judgment and caution during all interactions or transactions conducted via the Jobipo Platform.

We only act as a medium for connection and communication and do not endorse any party.


9. Children’s Privacy

Our services are intended only for users aged 18 and above. We do not knowingly collect or store personal information from children. If we discover that a child under 18 has submitted information, we will take immediate steps to delete it.


10. Data Security

We use industry-standard security measures, including SSL encryption, secure servers, and restricted access controls, to protect your personal data. While we take all reasonable precautions, no digital platform can be 100% secure. We urge users to maintain strong passwords and avoid sharing sensitive details publicly.


11. Updates to This Policy

This Privacy Policy may be updated periodically to reflect changes in technology, legal requirements, or platform features. We will notify you of any significant updates through in-app alerts, email, or website notifications. Your continued use of the platform indicates acceptance of the revised terms.

12. Contact Us

For any questions, complaints, or feedback related to privacy or data protection, please contact us:

📧 Email: support@jobipo.com
🌐 Website: www.jobipo.in
🏢 Company: Adshrtech Media Private Limited
📍 Address: Shop 17,18 Ganesh Nagar,Benar Road Nadi Ka Phatak, Neendar,Jaipur ,Jaipur- 302013 Rajasthan
              `}
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
      <Menu />
    </>
  );
};

export default Privacy;

const styles1 = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,
  },
  product: {
    backgroundColor: '#fff',
    width: '95%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 22,
    paddingBottom: 5,
    paddingHorizontal: 4,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 80,
    height: 80,
    flex: 2,
    backgroundColor: '#edfaff',
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  title: {
    color: '#595959',
    paddingTop: 0,
    fontSize: 14,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    width: '80%',
    paddingVertical: 0,
    borderRadius: 0,
    flex: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#EDFAFF',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
  },
  cardIcon: {
    fontSize: 15,
  },
  cardText: {
    fontSize: 15,
    color: '#0d4574',
  },
  card: {
    marginTop: 15,
  },
});







const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F8F8F8',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    color: '#535353',
  },
});

