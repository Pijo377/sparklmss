// xmlHelper.ts (or xmlHelper.js)
export const generateXML = (form: any) => {
  // Helper to format date as MM/DD/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const xml = `
<LeadDetails> 
  <LeadTransactionInformation> 
    <StoreName>SparkLMS</StoreName> 
    <MerchandiseName>LOAN</MerchandiseName> 
    <CampaignName>Test Campaign</CampaignName> 
    <UserName>TestUser</UserName> 
    <Password>Password</Password> 
    <LeadDate>${formatDate(new Date().toISOString())}</LeadDate> 
    <AffiliateId>100</AffiliateId> 
    <SubAffiliateId>123</SubAffiliateId> 
    <ProductType>I</ProductType> 
  </LeadTransactionInformation> 
  <LPInformation> 
    <PromoID/> 
    <PromoSubCode/> 
    <AcceptStatus>A</AcceptStatus> 
    <LeadDecisionID>3</LeadDecisionID> 
    <Reason>Success</Reason> 
    <AutoOriginateStatus>N</AutoOriginateStatus> 
    <DCIT_LEAD_ID>2750930996</DCIT_LEAD_ID> 
  </LPInformation> 
  <CustomerDeviceDetail> 
    <IPAddress>15.204.52.64</IPAddress> 
    <BrowserName>Chrome</BrowserName> 
    <BrowserVersion>10.24.1</BrowserVersion> 
    <DevicePlatform>DeskTop[or]LapTop</DevicePlatform> 
    <OperatingSystem>win32</OperatingSystem> 
    <OSVersion>10.0.20348</OSVersion> 
    <TimeZone>+00:00</TimeZone> 
    <BatteryLevel/> 
    <Brand/> 
    <Carrier/> 
    <DeviceCountry>US</DeviceCountry> 
    <DeviceID/> 
    <DeviceLanguage/> 
    <DeviceManufacturer/> 
    <DeviceModel/> 
    <IsTablet>0</IsTablet> 
    <DeviceUniqueID/> 
    <AcceptLanguage>en-US</AcceptLanguage> 
    <UserAgent>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36</UserAgent> 
  </CustomerDeviceDetail> 
  <LoanInformation> 
    <DateApplied>${formatDate(new Date().toISOString())}</DateApplied> 
    <LoanAmount>${form.LoanAmount || ''}</LoanAmount> 
    <RequestedEffectiveDate>${formatDate(form.FirstPaymentDate)}</RequestedEffectiveDate> 
    <RequestedDueDate>${formatDate(form.NextPayDate)}</RequestedDueDate> 
    <IPAddress>15.204.52.64</IPAddress> 
    <Agreementstatus>Y</Agreementstatus> 
  </LoanInformation> 
  <CustomerInformation> 
    <PersonalInformation> 
      <FirstName>${form.FirstName || ''}</FirstName> 
      <LastName>${form.LastName || ''}</LastName> 
      <Suffix>${form.Suffix || ''}</Suffix> 
      <Address>${form.Address || ''}</Address> 
      <City>${form.City || ''}</City> 
      <State>${form.State || ''}</State> 
      <Zip>${form.Zip || ''}</Zip> 
      <Zip4>${form.Zip4 || ''}</Zip4> 
      <HomeStatus>${form.homestatus || '1'}</HomeStatus> 
      <Email>${form.Email || ''}</Email> 
      <DateOfBirth>${formatDate(form.DOB)}</DateOfBirth> 
      <DrivingLicenseState>${form.DLState || ''}</DrivingLicenseState> 
      <DrivingLicenseNumber>${form.License || ''}</DrivingLicenseNumber> 
      <IsClaimedMilitary>${form.militarymem || '0'}</IsClaimedMilitary> 
      <PrimaryPhone>${form.MobilePhone || ''}</PrimaryPhone> 
      <HomePhone>${form.HomePhone || ''}</HomePhone> 
      <MobilePhone>${form.MobilePhone || ''}</MobilePhone> 
      <Fax>${form.Fax || ''}</Fax> 
      <Is18YearsOld>${form.Is18YearsOld || ''}</Is18YearsOld> 
      <IsBankrupted>${form.IsBankrupted || ''}</IsBankrupted> 
      <IsEmailVerified>N</IsEmailVerified> 
      <IsMilitary>${form.militarymem || ''}</IsMilitary> 
      <PreferredLanguage>${form.Language === 'Spanish' ? 'ES' : 'EN'}</PreferredLanguage> 
      <MonthsAtCurrentAddress>0</MonthsAtCurrentAddress> 
      <YearsAtCurrentAddress>0</YearsAtCurrentAddress> 
      <AtCurAddressSince>${formatDate(form.AtAddressSince)}</AtCurAddressSince> 
      <SSN>${form.SSN || ''}</SSN> 
      <TimetoCall/> 
    </PersonalInformation> 
    <EmployerInformation> 
      <IncomeType>${form.EmploymentType === 'Full-Time' ? 'P' : 'S'}</IncomeType> 
      <OtherIncomeType>${form.OtherIncomeType || ''}</OtherIncomeType> 
      <EmployerName>${form.EmployerName || ''}</EmployerName> 
      <Address>${form.EmployerAddress || ''}</Address> 
      <City>${form.EmployerCity || ''}</City> 
      <State>${form.EmployerState || ''}</State> 
      <Zip>${form.EmployerZip || ''}</Zip> 
      <Zip4/> 
      <Phone>${form.WorkPhone || ''}</Phone> 
      <shift/> 
      <PhoneExtn/> 
      <Fax/> 
      <PointOfContact/> 
      <BenefitStartdate>${formatDate(form.EmpStartDate)}</BenefitStartdate> 
      <BenefitEnddate/> 
      <JobTitle>${form.JobTitle || ''}</JobTitle> 
      <JobType>${form.EmploymentType === 'Full-Time' ? 'F' : 'P'}</JobType> 
      <PayRollType>${form.ReceivePaycheck || 'D'}</PayRollType> 
      <Periodicity>${form.Frequency ? (form.Frequency === 'Bi-Weekly' ? 'B' : form.Frequency === 'Weekly' ? 'W' : form.Frequency === 'Semi-Monthly' ? 'S' : 'M') : 'M'}</Periodicity> 
      <PayGarnishment/> 
      <SemiMonthlyPayDay01>${form.SemiMonthlyPayDay01 || ''}</SemiMonthlyPayDay01> 
      <SemiMonthlyPayDay02>${form.SemiMonthlyPayDay02 || ''}</SemiMonthlyPayDay02> 
      <PayWeek1>${form.PayWeek1 || ''}</PayWeek1> 
      <PayWeek2>${form.PayWeek2 || ''}</PayWeek2> 
      <IsAfterHoliday/> 
      <AfterWhichDay/> 
      <IsPrimary>P</IsPrimary> 
      <Frequency>${form.Frequency === 'Bi-Weekly' ? 'B' : (form.Frequency === 'Weekly' ? 'W' : (form.Frequency === 'Semi-Monthly' ? 'S' : 'M'))}</Frequency> 
      <LastPayDate>${formatDate(form.LastPayDate)}</LastPayDate> 
      <NextPayDate>${formatDate(form.NextPayDate)}</NextPayDate> 
      <SecondPayDate>${formatDate(form.SecondPayDate)}</SecondPayDate> 
      <AverageSalary>${form.GrossPay || ''}</AverageSalary> 
      <WorkShift/> 
    </EmployerInformation> 
    <BankInformation> 
      <BankName>${form.BankName || ''}</BankName> 
      <ABANumber>${form.AbaNumber || ''}</ABANumber> 
      <AccountNumber>${form.AccountNumber || ''}</AccountNumber> 
      <AccountType>${form.AccountType || 'C'}</AccountType> 
      <Address/> 
      <City/> 
      <State/> 
      <ZipCode/> 
      <BankPhone/> 
      <AccountOpenDate>${formatDate(form.AccountDate)}</AccountOpenDate> 
    </BankInformation> 
    <References> 
      <Reference> 
        <FirstName>${form.RefName1 ? form.RefName1.split(' ')[0] : ''}</FirstName> 
        <LastName>${form.RefName1 ? form.RefName1.split(' ').slice(1).join(' ') : ''}</LastName> 
        <Relation>${form.RefRelation1 || ''}</Relation> 
        <MobilePhone>${form.RefPhone1 || ''}</MobilePhone> 
        <HomePhone>${form.RefPhone1 || ''}</HomePhone> 
        <Address/> 
        <City/> 
        <State/> 
        <zip/> 
        <Email>${form.RefEmail1 || ''}</Email> 
        <IsPrimary>P</IsPrimary> 
      </Reference> 
      <Reference> 
        <FirstName>${form.RefName2 ? form.RefName2.split(' ')[0] : ''}</FirstName> 
        <LastName>${form.RefName2 ? form.RefName2.split(' ').slice(1).join(' ') : ''}</LastName> 
        <Relation>${form.RefRelation2 || ''}</Relation> 
        <MobilePhone>${form.RefPhone2 || ''}</MobilePhone> 
        <HomePhone>${form.RefPhone2 || ''}</HomePhone> 
        <Address/> 
        <City/> 
        <State/> 
        <zip/> 
        <Email>${form.RefEmail2 || ''}</Email> 
        <IsPrimary>P</IsPrimary> 
      </Reference> 
    </References> 
    <AutoTitle> 
      <VehicleModel>${form.vehModel || ''}</VehicleModel> 
      <VehicleMake>${form.vehMake || ''}</VehicleMake> 
      <VehicleYear>${form.vehYear || ''}</VehicleYear> 
      <VehicleNumber>${form.vehNumber || ''}</VehicleNumber> 
      <VehicleOwnerName>${form.vehOwner || ''}</VehicleOwnerName> 
      <VIN>${form.vin || ''}</VIN> 
      <ChassisNumber>${form.chaseNumber || ''}</ChassisNumber> 
      <InsuranceNumber>${form.insuranceNumber || ''}</InsuranceNumber> 
      <isVehiclePaidoff>${form.paidOff || ''}</isVehiclePaidoff> 
      <Mileage>${form.mileage || ''}</Mileage> 
      <AmountOwed>0.00</AmountOwed> 
      <DrivingLicenseExpiryDate>${formatDate(form.expDate)}</DrivingLicenseExpiryDate> 
      <TitleCertificate>${form.certTitle || ''}</TitleCertificate> 
      <LicensePlate>${form.licensePlate || ''}</LicensePlate> 
    </AutoTitle> 
    <LandlordInformation> 
      <LandlordName/> 
      <LandlordPhone/> 
      <Amount/> 
      <DueDate/> 
    </LandlordInformation> 
    <AdditionalInformation> 
      <HeardAboutUsVia/> 
      <IsOptInForSMS>${form.IsOptInForSMS || '1'}</IsOptInForSMS> 
    </AdditionalInformation> 
  </CustomerInformation> 
</LeadDetails>`;
  return xml.trim();
};