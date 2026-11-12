import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";

// الشؤون المالية
import Budgetbulletin from "./components/Financial affairs/Budgetbulletin";
import Expensesprogramme from "./components/Financial affairs/Expensesprogramme";
import Scientificmaterial from "./components/Financial affairs/Scientificmaterial";
import Visualexplanation from "./components/Financial affairs/Visualexplanation";
import Outcomes from "./components/Financial affairs/Outcomes";

// الصفحات الجديدة
import GeneralExpenses from "./components/GeneralExpenses/GeneralExpenses";
import FirstChapterExpenses from "./components/FirstChapterExpenses/FirstChapterExpenses";
import Stores from "./components/Stores/Stores";
import Excel from "./components/excel/Excel";
import Contact from "./components/contact/contact";

// لوحة تحكم الأدمن
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminHome from "./admin/AdminHome";
import AdminAdmins from "./admin/AdminAdmins";
import CategoriesAdmin from "./admin/CategoriesAdmin";
import MediaAdmin from "./admin/media/MediaAdmin";
import GenericSectionPage from "./components/media/GenericSectionPage";

function App() {

  const router = createBrowserRouter([
    {
      // لوحة تحكم الأدمن — خارج الواجهة العامة
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminHome /> },
        { path: "videos", element: <MediaAdmin type="video" /> },
        { path: "pdfs", element: <MediaAdmin type="pdf" /> },
        { path: "admins", element: <AdminAdmins /> },
        { path: "categories", element: <CategoriesAdmin /> },
        { path: "*", element: <Navigate to="/admin" replace /> },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [

        // الرئيسية
        { path: "/", element: <Home /> },

        // صفحات عامة
        { path: "/sidebar", element: <Sidebar /> },
        { path: "/footer", element: <Footer /> },

        // الشؤون المالية
        { path: "/budget_bulletin", element: <Budgetbulletin /> },
        { path: "/scientific_material", element: <Scientificmaterial /> },
        { path: "/expenses_programme", element: <Expensesprogramme /> },
        { path: "/visual_explanation", element: <Visualexplanation /> },
        { path: "/outcome", element: <Outcomes /> },
        { path: "/contact", element: <Contact /> },

        // الصفحات الجديدة
        { path: "/general_expenses", element: <GeneralExpenses /> },
        { path: "/first_chapter_expenses", element: <FirstChapterExpenses /> },
        { path: "/stores", element: <Stores /> },
        { path: "/excel", element: <Excel /> },
        // أي قسم جديد يُضاف من لوحة التحكم يظهر على هذا المسار العام
        { path: "/section/:slug", element: <GenericSectionPage /> },
        { path: "*", element: <Navigate to="/" replace /> },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;