import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

function App() {

  const router = createBrowserRouter([
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

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;