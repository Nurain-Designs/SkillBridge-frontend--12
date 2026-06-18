import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

def create_presentation():
    prs = Presentation()
    # Set slide dimensions to widescreen (16:9)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # ------------------ DESIGN TOKENS ------------------
    COLOR_BG = RGBColor(15, 23, 42)          # Sleek Slate 900
    COLOR_PANEL = RGBColor(30, 41, 59)       # Sleek Slate 800
    COLOR_TEXT_PRIMARY = RGBColor(255, 255, 255) # White
    COLOR_TEXT_MUTED = RGBColor(148, 163, 184)   # Slate 400 (Muted Body)
    COLOR_ACCENT = RGBColor(56, 189, 248)        # Electric Blue / Cyan
    COLOR_ACCENT_ALT = RGBColor(129, 140, 248)    # Indigo
    COLOR_ACCENT_GREEN = RGBColor(16, 185, 129)  # Green Accent
    
    FONT_TITLE = "Segoe UI"
    FONT_BODY = "Segoe UI"
    
    # Helper to add a dark background to a slide
    def apply_dark_background(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = COLOR_BG
        
    # Helper to add transition to make slide deck animated
    def apply_fade_transition(slide):
        transition_xml = f'<p:transition {nsdecls("p")}><p:fade/></p:transition>'
        transition_element = parse_xml(transition_xml)
        slide.element.append(transition_element)
        
    # Helper to add a clean slide title header
    def add_slide_header(slide, title_text, category_text="INTERNSHIP REPORT"):
        # Category tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = FONT_BODY
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT
        
        # Main slide title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = FONT_TITLE
        p_title.font.size = Pt(36)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_PRIMARY
        
        # Elegant bottom accent line under the header
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 
            Inches(0.8), Inches(1.6), Inches(2.5), Inches(0.06)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_ACCENT
        line.line.fill.background() # No border
        
    # Helper to create styled card panels
    def add_panel(slide, left, top, width, height, bg_color):
        panel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        panel.fill.solid()
        panel.fill.fore_color.rgb = bg_color
        panel.line.color.rgb = COLOR_PANEL
        panel.line.width = Pt(1.5)
        return panel

    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # ==========================================
    # SLIDE 1: Company Name (Title Slide)
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    apply_dark_background(slide1)
    apply_fade_transition(slide1)
    
    # Large colored geometric highlight in the background
    panel_left = add_panel(slide1, Inches(0.8), Inches(1.5), Inches(11.733), Inches(4.8), COLOR_PANEL)
    
    # Left decorative vertical glow bar
    glow = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(0.12), Inches(4.8))
    glow.fill.solid()
    glow.fill.fore_color.rgb = COLOR_ACCENT
    glow.line.fill.background()
    
    # Text container inside panel
    title_box = slide1.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(10.5), Inches(3.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "MJ SMART SOLUTIONS"
    p1.font.name = FONT_TITLE
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_PRIMARY
    p1.space_after = Pt(10)
    
    p2 = tf1.add_paragraph()
    p2.text = "INTELLIGENT SOLUTIONS FOR PROFESSIONAL GROWTH"
    p2.font.name = FONT_TITLE
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_ACCENT
    p2.space_after = Pt(24)
    
    p3 = tf1.add_paragraph()
    p3.text = "MJ Smart Solutions is an innovative technology organization focused on developing intelligent platforms for career development and professional growth. We leverage advanced Artificial Intelligence, Natural Language Processing, and vector stores to bridge the gap between existing user skills and rapidly evolving workforce demands."
    p3.font.name = FONT_BODY
    p3.font.size = Pt(14)
    p3.font.color.rgb = COLOR_TEXT_MUTED
    p3.space_after = Pt(15)

    # ==========================================
    # SLIDE 2: Company Profile
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    apply_dark_background(slide2)
    apply_fade_transition(slide2)
    add_slide_header(slide2, "Company Profile", "02. Profile")
    
    # Left Column: Overview & Mission
    add_panel(slide2, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.6), COLOR_PANEL)
    glow_left = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.0), Inches(5.6), Inches(0.1))
    glow_left.fill.solid()
    glow_left.fill.fore_color.rgb = COLOR_ACCENT
    glow_left.line.fill.background()
    
    tb_left = slide2.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.0))
    tf_l = tb_left.text_frame
    tf_l.word_wrap = True
    
    p_l_title = tf_l.paragraphs[0]
    p_l_title.text = "COMPANY OVERVIEW"
    p_l_title.font.name = FONT_TITLE
    p_l_title.font.size = Pt(20)
    p_l_title.font.bold = True
    p_l_title.font.color.rgb = COLOR_ACCENT
    p_l_title.space_after = Pt(12)
    
    p_l_body = tf_l.add_paragraph()
    p_l_body.text = "Focused on developing AI-powered tools to bridge the gap between existing user competencies and rapidly evolving industry demands. MJ Smart Solutions delivers secure, localized, and intelligent career advising frameworks."
    p_l_body.font.name = FONT_BODY
    p_l_body.font.size = Pt(13)
    p_l_body.font.color.rgb = COLOR_TEXT_PRIMARY
    p_l_body.space_after = Pt(18)
    
    p_m_title = tf_l.add_paragraph()
    p_m_title.text = "OUR MISSION"
    p_m_title.font.name = FONT_TITLE
    p_m_title.font.size = Pt(20)
    p_m_title.font.bold = True
    p_m_title.font.color.rgb = COLOR_ACCENT
    p_m_title.space_after = Pt(12)
    
    p_m_body = tf_l.add_paragraph()
    p_m_body.text = "To democratize career development by providing accessible, intelligent, and AI-driven professional guidance and targeted learning roadmaps."
    p_m_body.font.name = FONT_BODY
    p_m_body.font.size = Pt(13)
    p_m_body.font.color.rgb = COLOR_TEXT_PRIMARY
    
    # Right Column: Vision & Core Tech
    add_panel(slide2, Inches(6.933), Inches(2.0), Inches(5.6), Inches(4.6), COLOR_PANEL)
    glow_right = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.933), Inches(2.0), Inches(5.6), Inches(0.1))
    glow_right.fill.solid()
    glow_right.fill.fore_color.rgb = COLOR_ACCENT_ALT
    glow_right.line.fill.background()
    
    tb_right = slide2.shapes.add_textbox(Inches(7.233), Inches(2.3), Inches(5.0), Inches(4.0))
    tf_r = tb_right.text_frame
    tf_r.word_wrap = True
    
    p_r_title = tf_r.paragraphs[0]
    p_r_title.text = "OUR VISION"
    p_r_title.font.name = FONT_TITLE
    p_r_title.font.size = Pt(20)
    p_r_title.font.bold = True
    p_r_title.font.color.rgb = COLOR_ACCENT_ALT
    p_r_title.space_after = Pt(12)
    
    p_r_body = tf_r.add_paragraph()
    p_r_body.text = "To create a future where every individual has access to smart tools enabling continuous learning, professional growth, and seamless adaptation to changing workforce demands."
    p_r_body.font.name = FONT_BODY
    p_r_body.font.size = Pt(13)
    p_r_body.font.color.rgb = COLOR_TEXT_PRIMARY
    p_r_body.space_after = Pt(18)
    
    p_t_title = tf_r.add_paragraph()
    p_t_title.text = "CORE TECHNOLOGIES"
    p_t_title.font.name = FONT_TITLE
    p_t_title.font.size = Pt(20)
    p_t_title.font.bold = True
    p_t_title.font.color.rgb = COLOR_ACCENT_ALT
    p_t_title.space_after = Pt(12)
    
    p_t_body = tf_r.add_paragraph()
    p_t_body.text = "• Artificial Intelligence & LLMs (Llama 3.2)\n• Natural Language Processing (spaCy NLP)\n• FAISS Vector Store / RAG Systems\n• React, Vite & Tailwind CSS"
    p_t_body.font.name = FONT_BODY
    p_t_body.font.size = Pt(13)
    p_t_body.font.color.rgb = COLOR_TEXT_PRIMARY

    # ==========================================
    # SLIDE 3: Role of the Intern
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    apply_dark_background(slide3)
    apply_fade_transition(slide3)
    add_slide_header(slide3, "Role of the Intern", "03. Role")
    
    # Main Profile Card
    add_panel(slide3, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.6), COLOR_PANEL)
    
    glow_role = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.0), Inches(0.12), Inches(4.6))
    glow_role.fill.solid()
    glow_role.fill.fore_color.rgb = COLOR_ACCENT
    glow_role.line.fill.background()
    
    # Left Content - Title Info
    tb_role_l = slide3.shapes.add_textbox(Inches(1.2), Inches(2.4), Inches(4.5), Inches(3.8))
    tf_rl = tb_role_l.text_frame
    tf_rl.word_wrap = True
    
    p_rl_title = tf_rl.paragraphs[0]
    p_rl_title.text = "Full-Stack AI Developer & UI/UX Designer Intern"
    p_rl_title.font.name = FONT_TITLE
    p_rl_title.font.size = Pt(26)
    p_rl_title.font.bold = True
    p_rl_title.font.color.rgb = COLOR_TEXT_PRIMARY
    p_rl_title.space_after = Pt(14)
    
    p_rl_loc = tf_rl.add_paragraph()
    p_rl_loc.text = "MJ SMART SOLUTIONS"
    p_rl_loc.font.name = FONT_TITLE
    p_rl_loc.font.size = Pt(14)
    p_rl_loc.font.bold = True
    p_rl_loc.font.color.rgb = COLOR_ACCENT
    p_rl_loc.space_after = Pt(14)
    
    p_rl_desc = tf_rl.add_paragraph()
    p_rl_desc.text = "An active, hands-on role dedicated to designing and building both the intelligent agentic backend and high-fidelity user experiences for modern platforms."
    p_rl_desc.font.name = FONT_BODY
    p_rl_desc.font.size = Pt(13)
    p_rl_desc.font.color.rgb = COLOR_TEXT_MUTED
    
    # Right Content - Detailed Responsibilities
    tb_role_r = slide3.shapes.add_textbox(Inches(6.0), Inches(2.4), Inches(6.0), Inches(3.8))
    tf_rr = tb_role_r.text_frame
    tf_rr.word_wrap = True
    
    p_rr_t = tf_rr.paragraphs[0]
    p_rr_t.text = "CORE RESPONSIBILITIES"
    p_rr_t.font.name = FONT_TITLE
    p_rr_t.font.size = Pt(18)
    p_rr_t.font.bold = True
    p_rr_t.font.color.rgb = COLOR_ACCENT_ALT
    p_rr_t.space_after = Pt(14)
    
    resp_list = [
        ("UI/UX Design & Figma Layouts", "Crafting visually premium, responsive glassmorphism structures and digital wireframes in Figma."),
        ("Frontend Application Engineering", "Building modular and highly responsive dashboard components using React, Vite, and Tailwind CSS."),
        ("Agentic AI Implementation", "Configuring autonomous reasoning agents using Python, LangChain, spaCy, and local Llama 3.2.")
    ]
    
    for title, desc in resp_list:
        p_item = tf_rr.add_paragraph()
        p_item.text = f"• {title}: "
        p_item.font.name = FONT_BODY
        p_item.font.size = Pt(13.5)
        p_item.font.bold = True
        p_item.font.color.rgb = COLOR_TEXT_PRIMARY
        p_item.space_after = Pt(4)
        
        run = p_item.add_run()
        run.text = desc
        run.font.name = FONT_BODY
        run.font.size = Pt(12)
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED
        p_item.space_after = Pt(12)

    # ==========================================
    # SLIDE 4: Activities Performed
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    apply_dark_background(slide4)
    apply_fade_transition(slide4)
    add_slide_header(slide4, "Activities Performed", "04. Activities")
    
    # 4 Grid Columns representing modern tech panels
    activities = [
        ("UI/UX & Figma", "Designed high-fidelity mockups, grid wireframes, and digital assets implementing a premium 3D glassmorphism theme.", COLOR_ACCENT),
        ("Frontend Stack", "Developed clean, interactive dashboard components and robust routes utilizing React, Vite, and Tailwind CSS.", COLOR_ACCENT),
        ("NLP & Parsing", "Built Python-based spaCy pipelines to dynamically process unstructured resume data and extract skills.", COLOR_ACCENT_ALT),
        ("AI Agent & RAG", "Integrated LangChain agents and FAISS vector databases to analyze skill gaps and produce 4-week roadmap schedules.", COLOR_ACCENT_GREEN)
    ]
    
    panel_width = Inches(2.78)
    panel_height = Inches(4.5)
    gap = Inches(0.2)
    start_left = Inches(0.8)
    
    for i, (title, desc, color) in enumerate(activities):
        curr_left = start_left + i * (panel_width + gap)
        add_panel(slide4, curr_left, Inches(2.1), panel_width, panel_height, COLOR_PANEL)
        
        # Color bar on top
        bar = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, curr_left, Inches(2.1), panel_width, Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = color
        bar.line.fill.background()
        
        # Text
        box = slide4.shapes.add_textbox(curr_left + Inches(0.2), Inches(2.3), panel_width - Inches(0.4), panel_height - Inches(0.4))
        tf = box.text_frame
        tf.word_wrap = True
        
        # Tag/Number
        p0 = tf.paragraphs[0]
        p0.text = f"Activity 0{i+1}"
        p0.font.name = FONT_BODY
        p0.font.size = Pt(12)
        p0.font.bold = True
        p0.font.color.rgb = color
        p0.space_after = Pt(14)
        
        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.name = FONT_TITLE
        p1.font.size = Pt(18)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_TEXT_PRIMARY
        p1.space_after = Pt(14)
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_BODY
        p2.font.size = Pt(12.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 5: External Guide Name & Address
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    apply_dark_background(slide5)
    apply_fade_transition(slide5)
    add_slide_header(slide5, "External Guide Details", "05. Guide")
    
    # Large beautiful card panel in center
    card_w = Inches(10.0)
    card_h = Inches(4.4)
    card_l = Inches(1.666)
    card_t = Inches(2.1)
    
    add_panel(slide5, card_l, card_t, card_w, card_h, COLOR_PANEL)
    
    # Top decorative colored gradient panel glow
    bar_guide = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, card_l, card_t, card_w, Inches(0.12))
    bar_guide.fill.solid()
    bar_guide.fill.fore_color.rgb = COLOR_ACCENT_ALT
    bar_guide.line.fill.background()
    
    tb_guide = slide5.shapes.add_textbox(card_l + Inches(0.5), card_t + Inches(0.4), card_w - Inches(1.0), card_h - Inches(0.8))
    tf_g = tb_guide.text_frame
    tf_g.word_wrap = True
    
    p_g_label = tf_g.paragraphs[0]
    p_g_label.text = "PROJECT GUIDE"
    p_g_label.font.name = FONT_BODY
    p_g_label.font.size = Pt(13)
    p_g_label.font.bold = True
    p_g_label.font.color.rgb = COLOR_ACCENT
    p_g_label.space_after = Pt(18)
    
    p_g_name = tf_g.add_paragraph()
    p_g_name.text = "ABHAY KUMAR SRIVASTAV"
    p_g_name.font.name = FONT_TITLE
    p_g_name.font.size = Pt(40)
    p_g_name.font.bold = True
    p_g_name.font.color.rgb = COLOR_TEXT_PRIMARY
    p_g_name.space_after = Pt(8)
    
    p_g_desig = tf_g.add_paragraph()
    p_g_desig.text = "Assistant Professor"
    p_g_desig.font.name = FONT_TITLE
    p_g_desig.font.size = Pt(20)
    p_g_desig.font.bold = True
    p_g_desig.font.color.rgb = COLOR_TEXT_MUTED
    p_g_desig.space_after = Pt(24)
    
    p_g_dept = tf_g.add_paragraph()
    p_g_dept.text = "School of Computer Science and Application"
    p_g_dept.font.name = FONT_BODY
    p_g_dept.font.size = Pt(16)
    p_g_dept.font.color.rgb = COLOR_TEXT_PRIMARY
    p_g_dept.space_after = Pt(6)
    
    p_g_inst = tf_g.add_paragraph()
    p_g_inst.text = "MJ Smart Solutions / Associated University Campus"
    p_g_inst.font.name = FONT_BODY
    p_g_inst.font.size = Pt(14)
    p_g_inst.font.color.rgb = COLOR_TEXT_MUTED

    # Save presentation
    filename = "MJ_Smart_Solutions_Profile.pptx"
    prs.save(filename)
    print(f"Presentation saved successfully as '{filename}'!")

if __name__ == "__main__":
    create_presentation()
