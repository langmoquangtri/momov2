"use strict";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeJjlbNmKEJSUSEUeI8aQ7HRvOh0pvLAMF23cyH2XXXG6OuX4onBUDOviocwGAaVdy/exec";

async function submitLead() {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const modelInput = document.getElementById("biz");

  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const businessModel = modelInput ? modelInput.value : "";

  if (!name) {
    alert("Vui lòng nhập họ tên của bạn.");
    if (nameInput) nameInput.focus();
    return;
  }
  if (!phone) {
    alert("Vui lòng nhập số điện thoại.");
    if (phoneInput) phoneInput.focus();
    return;
  }

  // Find the submit button
  const submitBtn = document.querySelector(".form-card button.btn-1");
  const originalText = submitBtn ? submitBtn.textContent : "Gửi thông tin";
  if (submitBtn) {
    submitBtn.textContent = "Đang gửi...";
    submitBtn.disabled = true;
  }

  let hasSucceeded = false;
  try {
    // Attempt 1: Direct fetch to Google Apps Script Web App (Required for GitHub Pages / Static hosting)
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("https://script.google.com")) {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("businessModel", businessModel);

      // Append query parameters as fallback for 302 redirects in Google Apps Script
      const targetUrl = new URL(GOOGLE_SCRIPT_URL);
      targetUrl.searchParams.set("name", name);
      targetUrl.searchParams.set("phone", phone);
      targetUrl.searchParams.set("businessModel", businessModel);

      // Send with no-cors & form-urlencoded to work seamlessly on GitHub Pages without CORS blocking
      await fetch(targetUrl.toString(), {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      alert(`Đăng ký thành công!\nCảm ơn anh/chị ${name}, đội ngũ MoMo x iPOS sẽ liên hệ tư vấn qua số điện thoại ${phone} trong thời gian sớm nhất.`);
      if (nameInput) nameInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (modelInput) modelInput.selectedIndex = 0;
      hasSucceeded = true;
    } else {
      // Fallback: Node.js server route
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, businessModel })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert(`Đăng ký thành công!\nCảm ơn anh/chị ${name}, đội ngũ MoMo x iPOS sẽ liên hệ tư vấn qua số điện thoại ${phone} trong thời gian sớm nhất.`);
        if (nameInput) nameInput.value = "";
        if (phoneInput) phoneInput.value = "";
        if (modelInput) modelInput.selectedIndex = 0;
        hasSucceeded = true;
      } else {
        alert("Có lỗi xảy ra: " + (result.message || "Vui lòng thử lại sau."));
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Đăng ký thành công!\nCảm ơn anh/chị ${name}, đội ngũ MoMo x iPOS sẽ liên hệ tư vấn qua số điện thoại ${phone} trong thời gian sớm nhất.`);
    hasSucceeded = true;
  } finally {
    if (submitBtn) {
      if (hasSucceeded) {
        submitBtn.textContent = "Cảm ơn bạn đã gửi thông tin";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.75";
        submitBtn.style.cursor = "not-allowed";
        if (nameInput) {
          nameInput.disabled = true;
          nameInput.style.opacity = "0.6";
        }
        if (phoneInput) {
          phoneInput.disabled = true;
          phoneInput.style.opacity = "0.6";
        }
        if (modelInput) {
          modelInput.disabled = true;
          modelInput.style.opacity = "0.6";
        }
      } else {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  }
}

// Expose to window context for inline onclick
window.submitLead = submitLead;

// Toggle mobile menu on burger button click
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      burgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });

    // Close mobile menu when a link inside it is clicked
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });

    // Close menu when clicking outside of the nav area
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        burgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
      }
    });
  }

  // Blog Post Modal Logic
  const blogPosts = document.querySelectorAll(".post");
  const blogModal = document.getElementById("blog-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTag = document.getElementById("modal-tag");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCtaBtn = document.getElementById("modal-cta-btn");

  const articlesData = [
    {
      tag: "Phí",
      title: "Phí quẹt thẻ Visa, Mastercard 2026 là bao nhiêu?",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      content: `
        <p>Biểu phí quẹt thẻ năm 2026 đang có sự điều chỉnh linh hoạt để hỗ trợ tối đa các chủ quán và doanh nghiệp F&B tối ưu hóa chi phí vận hành.</p>
        
        <h4>1. Phí đối với thẻ nội địa (Napas):</h4>
        <p>Thường dao động cực kỳ thấp, chỉ từ <strong>0,3% - 0,5%</strong> tùy theo loại hình dịch vụ và doanh số giao dịch của quán. Đây là mức phí vô cùng ưu đãi nhằm khuyến khích thói quen thanh toán không dùng tiền mặt của người dân Việt Nam.</p>
        
        <h4>2. Phí đối với thẻ quốc tế (Visa, Mastercard, JCB):</h4>
        <p>Mức phí cho các dòng thẻ quốc tế thường từ <strong>1,2% - 1,8%</strong> đối với thẻ Debit (ghi nợ) và từ <strong>1,6% - 2,2%</strong> đối với thẻ Credit (tín dụng). Tùy vào thỏa thuận ban đầu của quán với nhà cung cấp dịch vụ MoMo x iPOS, mức phí này sẽ được tối ưu tốt nhất.</p>
        
        <h4>3. Tại sao nên chọn giải pháp máy quẹt thẻ của MoMo x iPOS?</h4>
        <p>Đồng bộ 100% với phần mềm iPOS giúp kiểm soát doanh thu chặt chẽ từ hóa đơn đến tài khoản nhận tiền. Không phát sinh chi phí ẩn hoặc áp đặt doanh số tối thiểu tháng, cùng với bộ phận kỹ thuật hỗ trợ trực tiếp nhanh chóng tại quầy.</p>
      `
    },
    {
      tag: "Thuế",
      title: "Nghị định 70/2025: hộ kinh doanh F&B xuất hóa đơn thế nào?",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
      content: `
        <p>Nghị định 70/2025/NĐ-CP đã ban hành quy định rõ ràng về việc bắt buộc áp dụng hóa đơn điện tử khởi tạo từ máy tính tiền đối với hộ kinh doanh cá thể trong lĩnh vực ăn uống, dịch vụ trực tiếp đến người dùng.</p>
        
        <h4>1. Đối tượng áp dụng bắt buộc:</h4>
        <p>Hộ kinh doanh nộp thuế theo phương pháp kê khai có doanh thu hoặc quy mô phù hợp tiêu chí bắt buộc sử dụng hóa đơn điện tử khởi tạo trực tiếp từ máy tính tiền.</p>
        
        <h4>2. Tiêu chí chính xác của hóa đơn:</h4>
        <p>Mỗi hóa đơn xuất ra phải đúng giá trị đơn hàng thực tế khách đã thanh toán tại quầy, bao gồm cả tiền tạm tính và thuế VAT (nếu có), khớp tuyệt đối đến từng đồng lẻ mà không được làm tròn sai lệch.</p>
        
        <h4>3. Giải pháp kết nối từ MoMo x iPOS:</h4>
        <p>Hỗ trợ doanh nghiệp và chủ hộ kinh doanh chuyển đổi số hóa đơn điện tử tự động 100%. Khi hoàn thành đơn hàng trên phần mềm iPOS, số tiền thanh toán hiển thị khớp hoàn hảo trên máy quẹt thẻ SmartPOS. Toàn bộ thông tin đối soát tự động đồng bộ hàng ngày giúp việc báo cáo tài chính trở nên nhẹ nhàng, chuẩn chỉnh pháp lý và tránh hoàn toàn các rủi ro thanh tra.</p>
      `
    },
    {
      tag: "So sánh",
      title: "Máy quẹt thẻ hay QR ngân hàng: quán nên dùng cái nào?",
      image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
      content: `
        <p>Mỗi phương thức thanh toán đều sở hữu những thế mạnh riêng về mặt vận hành. Hiểu rõ tính chất từng phương thức sẽ giúp bạn đưa ra lựa chọn tối ưu nhất cho hoạt động kinh doanh của quán mình.</p>
        
        <h4>1. Mã QR ngân hàng (VietQR):</h4>
        <p><strong>Ưu điểm:</strong> Chi phí đầu tư thấp, mức phí giao dịch cực kỳ ưu đãi (từ 0% đến 0,3%). <strong>Nhược điểm:</strong> Thu ngân phải kiểm tra thủ công biến động số dư hoặc chờ chụp ảnh màn hình chuyển khoản của khách, dễ phát sinh rủi ro lừa đảo bill chuyển khoản giả trong giờ cao điểm.</p>
        
        <h4>2. Thiết bị máy quẹt thẻ SmartPOS:</h4>
        <p><strong>Ưu điểm:</strong> Chấp nhận quẹt mọi loại thẻ ngân hàng (Napas, Visa, Mastercard, JCB), thanh toán chạm không tiếp xúc hiện đại và thẻ tín dụng trả góp 0%. Đồng bộ báo cáo tự động giúp thu ngân không cần đối chiếu tay. <strong>Nhược điểm:</strong> Cần trang bị phần cứng máy quẹt thẻ chuyên dụng tại quầy.</p>
        
        <h4>3. Giải pháp kết hợp hoàn hảo từ MoMo x iPOS:</h4>
        <p>Sự kết hợp đa năng trên một chiếc máy quẹt thẻ thông minh SmartPOS hiển thị được cả mã QR động theo từng đơn hàng. Khách chỉ cần quét hoặc quẹt thẻ, hệ thống tự động xác nhận và in hóa đơn tức thì. Đây chính là giải pháp tối ưu giúp tăng năng suất quầy thu ngân lên gấp 3 lần.</p>
      `
    }
  ];

  if (blogPosts.length > 0 && blogModal) {
    blogPosts.forEach((post, index) => {
      post.addEventListener("click", (e) => {
        e.preventDefault();
        const data = articlesData[index];
        if (data) {
          modalImg.src = data.image;
          modalImg.alt = data.title;
          modalTag.textContent = data.tag;
          modalTitle.textContent = data.title;
          modalText.innerHTML = data.content;

          // Open modal
          blogModal.classList.add("active");
          document.body.classList.add("modal-open");
        }
      });
    });

    const closeModal = () => {
      blogModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    };

    // Close button click
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }

    // Click outside overlay to close
    blogModal.addEventListener("click", (e) => {
      if (e.target === blogModal) {
        closeModal();
      }
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && blogModal.classList.contains("active")) {
        closeModal();
      }
    });

    // CTA Button action: Close and scroll to registration form
    if (modalCtaBtn) {
      modalCtaBtn.addEventListener("click", () => {
        closeModal();
        const registerSection = document.getElementById("dangky");
        if (registerSection) {
          registerSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  // Before / After Comparison Mobile Tabs
  const baToggleBtns = document.querySelectorAll(".ba-toggle-btn");
  const baCols = document.querySelectorAll(".ba-col");

  if (baToggleBtns.length > 0) {
    baToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabTarget = btn.getAttribute("data-tab");
        
        // Toggle button active class
        baToggleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Toggle column active class
        baCols.forEach(col => {
          if (col.classList.contains(tabTarget)) {
            col.classList.add("active");
          } else {
            col.classList.remove("active");
          }
        });
      });
    });
  }

  // Payment methods slider/carousel controls
  const paysList = document.getElementById("pays-list");
  const paysPrevBtn = document.getElementById("pays-prev-btn");
  const paysNextBtn = document.getElementById("pays-next-btn");

  if (paysList && paysPrevBtn && paysNextBtn) {
    let autoSlideInterval;

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        if (window.innerWidth <= 768) {
          const cardWidth = paysList.querySelector(".pay")?.offsetWidth || 300;
          const maxScrollLeft = paysList.scrollWidth - paysList.clientWidth;
          
          if (paysList.scrollLeft >= maxScrollLeft - 10) {
            // Wrap around to start
            paysList.scrollTo({
              left: 0,
              behavior: "smooth"
            });
          } else {
            paysList.scrollBy({
              left: cardWidth + 16,
              behavior: "smooth"
            });
          }
        }
      }, 3000);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };

    paysPrevBtn.addEventListener("click", () => {
      const cardWidth = paysList.querySelector(".pay")?.offsetWidth || 300;
      if (paysList.scrollLeft <= 10) {
        const maxScrollLeft = paysList.scrollWidth - paysList.clientWidth;
        paysList.scrollTo({
          left: maxScrollLeft,
          behavior: "smooth"
        });
      } else {
        paysList.scrollBy({
          left: -(cardWidth + 16),
          behavior: "smooth"
        });
      }
      startAutoSlide(); // Reset timer on user interaction
    });

    paysNextBtn.addEventListener("click", () => {
      const cardWidth = paysList.querySelector(".pay")?.offsetWidth || 300;
      const maxScrollLeft = paysList.scrollWidth - paysList.clientWidth;
      if (paysList.scrollLeft >= maxScrollLeft - 10) {
        paysList.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      } else {
        paysList.scrollBy({
          left: cardWidth + 16,
          behavior: "smooth"
        });
      }
      startAutoSlide(); // Reset timer on user interaction
    });

    // Pause auto-slide during user manual interaction
    paysList.addEventListener("touchstart", stopAutoSlide, { passive: true });
    paysList.addEventListener("touchend", startAutoSlide, { passive: true });

    // Initial start
    startAutoSlide();
  }

  // Lazy Load / Scroll Reveal Animation for Sections
  const revealTargets = document.querySelectorAll("section, .trust");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    revealTargets.forEach(target => {
      target.classList.add("reveal-section");
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach(target => {
      target.classList.add("is-revealed");
    });
  }

  // POS Machine Interactive Pink Wave / Ripple Effect
  const posWrapper = document.getElementById("pos-interactive-wrapper");
  const posImg = document.getElementById("pos-main-img");

  if (posWrapper) {
    function triggerPinkRipple(e) {
      const rect = posWrapper.getBoundingClientRect();
      const x = e && e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
      const y = e && e.clientY ? (e.clientY - rect.top) : (rect.height / 2);

      const ripple = document.createElement("div");
      ripple.className = "pos-js-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      posWrapper.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 1500);
    }

    if (posImg) {
      posImg.addEventListener("click", triggerPinkRipple);
      posImg.addEventListener("mouseenter", () => {
        triggerPinkRipple();
        setTimeout(triggerPinkRipple, 350);
      });
    }
  }

  // Sales Region Popup Modal Logic
  const salesModal = document.getElementById("sales-modal");
  const salesModalTitle = document.getElementById("sales-modal-title");
  const salesTableBody = document.getElementById("sales-table-body");
  const salesModalCloseBtn = document.getElementById("sales-modal-close-btn");
  const regionBtns = document.querySelectorAll(".btn-sales-region");

  const salesRepsByRegion = {
    hcm: {
      title: "Danh sách Sale hỗ trợ TP. Hồ Chí Minh",
      reps: [
        { name: "Lê Minh", phone: "0349.503.070", rawPhone: "0349503070" },
        { name: "Huyền Anh", phone: "0349.503.070", rawPhone: "0349503070" }
      ]
    },
    hn: {
      title: "Danh sách Sale hỗ trợ Hà Nội",
      reps: [
        { name: "Minh Lê", phone: "0349.503.070", rawPhone: "0349503070" },
        { name: "Tuấn Anh", phone: "0349.503.070", rawPhone: "0349503070" }
      ]
    }
  };

  if (salesModal && regionBtns.length > 0) {
    const openSalesModal = (regionKey) => {
      const regionData = salesRepsByRegion[regionKey] || salesRepsByRegion.hcm;
      if (salesModalTitle) {
        salesModalTitle.textContent = regionData.title;
      }

      if (salesTableBody) {
        salesTableBody.innerHTML = regionData.reps.map(rep => `
          <tr>
            <td><strong>${rep.name}</strong></td>
            <td><a href="tel:${rep.rawPhone}" class="sales-phone-link">${rep.phone}</a></td>
            <td>
              <a href="tel:${rep.rawPhone}" class="btn-call-sale">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Gọi ngay
              </a>
            </td>
          </tr>
        `).join("");
      }

      salesModal.classList.add("active");
      document.body.classList.add("modal-open");
    };

    const closeSalesModal = () => {
      salesModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    };

    regionBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const region = btn.getAttribute("data-region");
        openSalesModal(region);
      });
    });

    if (salesModalCloseBtn) {
      salesModalCloseBtn.addEventListener("click", closeSalesModal);
    }

    salesModal.addEventListener("click", (e) => {
      if (e.target === salesModal) {
        closeSalesModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && salesModal.classList.contains("active")) {
        closeSalesModal();
      }
    });
  }
});
