import Footer from "../components/Footer";
import Header from "../components/Header";
import AuthProvider from "../context/authContext";
import CartProvider from "../context/cartContext";
import CurrencyProvider from "../context/currencyContext";
import "../styles/globals.css";
import { Box } from "gestalt";
import "gestalt/dist/gestalt.css";
import moment from "moment";
import Script from "next/script";
import "react-alice-carousel/lib/alice-carousel.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteConfigsProvider from "../context/siteConfigsContext";
import WishlistProvider from "../context/wishlistContext";

moment.locale("fr");

export default function App({ Component, pageProps }) {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <SiteConfigsProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastContainer />
              <Header />
              <Box minHeight="80vh">
                <Component {...pageProps} />
                <Script
                  id="smartupp-script"
                  type="text/javascript"
                  dangerouslySetInnerHTML={{
                    __html: `
                  var _smartsupp = _smartsupp || {};
                  _smartsupp.key = "8848edbdde61f3f14fa03d99eaa78b0074a40398";
                  window.smartsupp ||
                    (function (d) {
                      var s,
                        c,
                        o = (smartsupp = function () {
                          o._.push(arguments);
                        });
                      o._ = [];
                      s = d.getElementsByTagName("script")[0];
                      c = d.createElement("script");
                      c.type = "text/javascript";
                      c.charset = "utf-8";
                      c.async = true;
                      c.src = "https://www.smartsuppchat.com/loader.js?";
                      s.parentNode.insertBefore(c, s);
                    })(document);
                `,
                  }}
                ></Script>
                <Script
                  strategy="lazyOnload"
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                ></Script>
                <Script
                  id="ganalytics-script"
                  type="text/javascript"
                  dangerouslySetInnerHTML={{
                    __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${
                    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
                  }', {
                    'cookie_domain': '${
                      typeof window !== "undefined"
                        ? window.location.hostname
                        : ""
                    }',
                    cookieFlags: 'SameSite=None; Secure'
                    });
                `,
                  }}
                ></Script>
              </Box>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </SiteConfigsProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}
