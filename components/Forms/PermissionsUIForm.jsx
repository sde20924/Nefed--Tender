// components/PermissionForm.js
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  permissions: Yup.object().shape({
    dashboard: Yup.boolean(),
    application: Yup.object().shape({
      view: Yup.boolean(),
      accept: Yup.boolean(),
      reject: Yup.boolean(),
      download: Yup.boolean(),
      delete: Yup.boolean(),
      print: Yup.boolean(),
    }),
    tender: Yup.object().shape({
      view: Yup.boolean(),
      create: Yup.boolean(),
      edit: Yup.boolean(),
      delete: Yup.boolean(),
      demo: Yup.boolean(),
    }),
    report: Yup.object().shape({
      view: Yup.boolean(),
      auctionLogs: Yup.boolean(),
      tenderAllotment: Yup.boolean(),
      auctionBids: Yup.boolean(),
      bidPosition: Yup.boolean(),
      bidAllotment: Yup.boolean(),
      miniSummary: Yup.boolean(),
      tenderPartyWise: Yup.boolean(),
      tenderChallan: Yup.boolean(),
      tenderSSO: Yup.boolean(),
    }),
  }),
});

const PermissionForm = ({ onUpdate }) => {
  const handleChange = (e, setFieldValue, catName, key) => {
    const { name, checked } = e.target;
    setFieldValue(name, checked);
    onUpdate({ [catName]: { [key]: checked } });
  };

  return (
    <Formik
      initialValues={{
        permissions: {
          dashboard: false,
          application: {
            view: false,
            accept: false,
            reject: false,
            download: false,
            delete: false,
            print: false,
          },
          tender: {
            view: true,
            create: false,
            edit: false,
            delete: false,
            demo: false,
          },
          report: {
            view: false,
            auctionLogs: false,
            tenderAllotment: false,
            auctionBids: true,
            bidPosition: false,
            bidAllotment: false,
            miniSummary: false,
            tenderPartyWise: false,
            tenderChallan: false,
            tenderSSO: false,
          },
        },
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="max-w-90p mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {/* Dashboard Permissions */}
            <div>
              <h3 className="font-bold mb-2">Dashboard</h3>
              <label className="block">
                <Field
                  type="checkbox"
                  name="permissions.dashboard"
                  checked={values.permissions.dashboard}
                  onChange={(e) =>
                    handleChange(e, setFieldValue, "dashboard", "view")
                  }
                />
                <span className="ml-2">View</span>
              </label>
            </div>

            {/* Application Permissions */}
            <div>
              <h3 className="font-bold mb-2">Application</h3>
              {["view", "accept", "reject", "download", "delete", "print"].map(
                (perm) => (
                  <label key={perm} className="block">
                    <Field
                      type="checkbox"
                      name={`permissions.application.${perm}`}
                      checked={values.permissions.application[perm]}
                      onChange={(e) =>
                        handleChange(e, setFieldValue, "application", perm)
                      }
                    />
                    <span className="ml-2 capitalize">{perm}</span>
                  </label>
                )
              )}
            </div>

            {/* Tender Permissions */}
            <div>
              <h3 className="font-bold mb-2">Tender</h3>
              {["view", "create", "edit", "delete", "demo"].map((perm) => (
                <label key={perm} className="block">
                  <Field
                    type="checkbox"
                    name={`permissions.tender.${perm}`}
                    checked={values.permissions.tender[perm]}
                    onChange={(e) =>
                      handleChange(e, setFieldValue, "tender", perm)
                    }
                  />
                  <span className="ml-2 capitalize">{perm}</span>
                </label>
              ))}
            </div>

            {/* Report Permissions */}
            <div>
              <h3 className="font-bold mb-2">Report</h3>
              {[
                "view",
                "auctionLogs",
                "tenderAllotment",
                "auctionBids",
                "bidPosition",
                "bidAllotment",
                "miniSummary",
                "tenderPartyWise",
                "tenderChallan",
                "tenderSSO",
              ].map((perm) => (
                <label key={perm} className="block">
                  <Field
                    type="checkbox"
                    name={`permissions.report.${perm}`}
                    checked={values.permissions.report[perm]}
                    onChange={(e) =>
                      handleChange(e, setFieldValue, "report", perm)
                    }
                  />
                  <span className="ml-2 capitalize">
                    {perm.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PermissionForm;
